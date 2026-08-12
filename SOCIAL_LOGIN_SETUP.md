# Google / GitHub Login — Setup Guide

The sign-in page already shows **Continue with Google** and **Continue with
GitHub** buttons. The code is done (`signInWithOAuth` → Supabase → back to
`/auth/callback`). What remains is enabling the providers — this is config in
two places and takes ~10 minutes.

## 1. Supabase — enable the providers

1. Supabase dashboard → **Authentication → Sign In / Providers**.
2. Turn on **Google** and **GitHub**.
3. Each needs a **Client ID** and **Client Secret** (from step 2 below) pasted
   into its fields.
4. Under **Authentication → URL Configuration**:
   - **Site URL**: `https://www.kranthikumarkatta.in` (production)
   - **Redirect URLs**: add `https://www.kranthikumarkatta.in/**` and
     `http://localhost:3000/**` (local dev)

## 2. Create the OAuth apps

**Google (Google Cloud Console)**
1. https://console.cloud.google.com → create/select a project → **APIs &
   Services → OAuth consent screen** → fill app name/email (External).
2. **Credentials → Create credentials → OAuth client ID** → type **Web
   application**.
3. Authorized redirect URIs — add **both**:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
4. Copy the Client ID + Secret into Supabase (step 1).

**GitHub (github.com → Settings → Developer settings)**
1. **OAuth Apps → New OAuth App**.
2. Homepage URL: `https://www.kranthikumarkatta.in`
3. Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the Client ID + generate a Client Secret → paste into Supabase.

> `<your-project-ref>` is the subdomain of your Supabase project URL
> (e.g. `https://<ref>.supabase.co`).

## 3. Notes

- **New sign-ups** via Google/GitHub automatically create a `profiles` row
  (the existing `handle_new_user` trigger fires for OAuth too), with
  `role = 'visitor'`. Promote yourself the same way as with email:
  `update public.profiles set role = 'admin' where email = 'your@email.com';`
- **GitHub display name**: the trigger reads `full_name` from user metadata.
  GitHub usually supplies `name` instead, so the name may be blank until a
  password account is used. Optional fix (run once in SQL Editor):

  ```sql
  create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.profiles (id, email, full_name)
    values (
      new.id,
      new.email,
      coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'user_name',
        ''
      )
    );
    return new;
  end;
  $$ language plpgsql security definer;
  ```

- **Mobile app**: social login buttons are hidden in the native (Capacitor)
  app because OAuth needs the server callback route, which isn't shipped in
  the static export. Use email/password + Face ID on the app.
- First sign-in redirects to `/dashboard` (see `app/auth/callback/route.ts`).

## Files

```
lib/auth-context.tsx      – signInWithOAuth(provider) added
app/auth/page.tsx         – Google + GitHub buttons (web)
app/auth/callback/route.ts – already existed; exchanges the OAuth code
```
