-- =============================================================================
-- Real-time visitor analytics (Supabase)
-- -----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
--
-- Two new tables + security-definer RPC functions. All session/counter writes
-- go through RPCs so anonymous visitors can never read or mutate each other's
-- session data directly. Counters are incremented server-side (Postgres) with
-- per-visitor advisory locking, so duplicate counts, refreshes and multi-tab
-- traffic cannot inflate the numbers.
--
-- Live visitors = visitor_sessions rows whose last_seen is within 30 seconds.
-- Sessions are kept as history (pruned after 30 days of inactivity).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- One row per browsing session (one per tab; a tab refresh reuses the same
-- session_id via sessionStorage, so refreshes never create a new row).
create table public.visitor_sessions (
  id uuid primary key default uuid_generate_v4(),
  session_id text unique not null,          -- client-generated uuid (per tab)
  visitor_id text not null,                 -- stable per-browser id (localStorage)
  is_returning boolean not null default false, -- visitor id existed before this session
  counted boolean not null default false,   -- true once record_visitor counted this session
  browser text,
  device text,
  os text,
  country text,
  city text,
  landing_page text,                        -- entry path for the session
  referrer text,
  page_path text,                           -- current path (updated on heartbeat)
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

-- Single-row-per-key counters: 'total_visitors' (all-time, unique) and
-- 'today_visitors' (unique per day; `date` holds the YYYY-MM-DD it applies to,
-- so a new day automatically starts from 1 instead of accumulating).
create table public.analytics_counters (
  key text primary key,
  value bigint not null default 0,
  date text,
  updated_at timestamptz not null default now()
);

create index idx_visitor_sessions_last_seen on public.visitor_sessions (last_seen);
create index idx_visitor_sessions_visitor on public.visitor_sessions (visitor_id);

-- -----------------------------------------------------------------------------
-- RPC: upsert a session (create on first load, heartbeat on refresh/intervals)
-- -----------------------------------------------------------------------------
-- Used both for session creation (via the /api/analytics/session route, which
-- also attaches geo) and for client heartbeats. On conflict it only refreshes
-- last_seen/page_path — landing page, referrer and device info are preserved.
--
-- Any session that isn't `counted` yet is counted right here (via
-- record_visitor, which is idempotent per session), so a session is never
-- missed even if the client's initial session POST fails — the next heartbeat
-- heals it. This is what keeps refresh / multi-tab traffic from ever
-- double-counting: `counted` flips to true once, permanently.
create or replace function public.upsert_visitor_session(
  p_session_id text,
  p_visitor_id text,
  p_is_returning boolean default false,
  p_browser text default null,
  p_device text default null,
  p_os text default null,
  p_country text default null,
  p_city text default null,
  p_landing_page text default null,
  p_referrer text default null,
  p_page_path text default null
) returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_counted boolean;
begin
  insert into public.visitor_sessions
    (session_id, visitor_id, is_returning, browser, device, os, country, city,
     landing_page, referrer, page_path, created_at, last_seen)
  values
    (p_session_id, p_visitor_id, p_is_returning, p_browser, p_device, p_os,
     p_country, p_city, coalesce(p_landing_page, p_page_path), p_referrer,
     p_page_path, now(), now())
  on conflict (session_id) do update
    set last_seen = now(),
        page_path = excluded.page_path
  returning counted into v_counted;

  -- Self-heal: count sessions that slipped through without being counted.
  if not v_counted then
    perform public.record_visitor(p_session_id);
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC: count a session's visitor toward the totals (idempotent, race-safe)
-- -----------------------------------------------------------------------------
-- Increments total_visitors once per unique visitor ever, and today_visitors
-- once per unique visitor per calendar day. The `counted` flag on the session
-- row makes the function idempotent per session; a per-visitor advisory lock
-- serializes concurrent first-time visits (e.g. two tabs opening at once).
create or replace function public.record_visitor(p_session_id text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_session public.visitor_sessions;
  v_today text := to_char(now(), 'YYYY-MM-DD');
begin
  select * into v_session
    from public.visitor_sessions
   where session_id = p_session_id;

  -- Unknown session or already counted → nothing to do (refresh-safe).
  if v_session is null or v_session.counted then
    return;
  end if;

  -- Serialize concurrent counting for the same visitor.
  perform pg_advisory_xact_lock(hashtext('record_visitor_' || v_session.visitor_id)::bigint);

  -- First counted session for this visitor ever → bump the all-time counter.
  if not exists (
    select 1 from public.visitor_sessions
     where visitor_id = v_session.visitor_id and counted
  ) then
    insert into public.analytics_counters (key, value, date, updated_at)
    values ('total_visitors', 1, null, now())
    on conflict (key) do update
      set value = public.analytics_counters.value + 1,
          updated_at = now();
  end if;

  -- No counted session for this visitor today → bump today's counter.
  -- (If `date` is stale from a previous day, restart at 1 instead of adding.)
  if not exists (
    select 1 from public.visitor_sessions
     where visitor_id = v_session.visitor_id
       and counted
       and created_at::date = v_today::date
  ) then
    insert into public.analytics_counters (key, value, date, updated_at)
    values ('today_visitors', 1, v_today, now())
    on conflict (key) do update
      set value = case when public.analytics_counters.date = v_today
                       then public.analytics_counters.value + 1
                       else 1 end,
          date = v_today,
          updated_at = now();
  end if;

  update public.visitor_sessions set counted = true where id = v_session.id;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC: live stats for the public widget (single round-trip, no raw data leak)
-- -----------------------------------------------------------------------------
-- Returns { live, total, today } where live = distinct visitors seen in the
-- last 30 seconds (distinct dedupes multiple tabs of the same person).
create or replace function public.get_visitor_stats()
returns json
language sql security definer set search_path = public
as $$
  select json_build_object(
    'live',  coalesce((
      select count(distinct visitor_id)
        from public.visitor_sessions
       where last_seen > now() - interval '30 seconds'), 0),
    'total', coalesce((
      select value from public.analytics_counters where key = 'total_visitors'), 0),
    'today', coalesce((
      select value from public.analytics_counters
       where key = 'today_visitors'
         and date = to_char(now(), 'YYYY-MM-DD')), 0)
  );
$$;

-- -----------------------------------------------------------------------------
-- RPC: prune inactive session history (keeps the table bounded)
-- -----------------------------------------------------------------------------
-- Live visitors are unaffected (they are excluded by last_seen). Called
-- occasionally by clients; safe to run via cron instead.
create or replace function public.prune_visitor_sessions(p_older_than_days int default 30)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_deleted int;
begin
  delete from public.visitor_sessions
   where last_seen < now() - make_interval(days => p_older_than_days);
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security + grants
-- -----------------------------------------------------------------------------
alter table public.visitor_sessions enable row level security;
alter table public.analytics_counters enable row level security;

-- Sessions are private: only admins can read them. All writes happen through
-- the security-definer RPCs above, so no insert/update/delete policies needed.
create policy "Admin read sessions"
  on public.visitor_sessions for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Counter values are intentionally public (the widget displays them).
create policy "Public read counters"
  on public.analytics_counters for select
  using (true);

-- Let anonymous visitors call the tracking functions.
grant execute on function public.upsert_visitor_session(text, text, boolean, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.record_visitor(text) to anon, authenticated;
grant execute on function public.get_visitor_stats() to anon, authenticated;
grant execute on function public.prune_visitor_sessions(int) to anon, authenticated;
