-- ============================================================================
-- Make a user an admin (run once in the Supabase SQL Editor)
--
-- New accounts are created with role 'visitor'. To access /admin, promote
-- your own account:
--
--   1. Sign up on the site (Sign In → Sign up) with the email below
--   2. Run this query with your email
--   3. Sign in again → open /admin
--
-- WARNING: only run this for accounts you own.
-- ============================================================================

update public.profiles
set role = 'admin'
where email = 'your-email@example.com';

-- Verify:
-- select id, email, role from public.profiles where email = 'your-email@example.com';
