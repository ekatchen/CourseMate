# Supabase Setup

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

Add these to `.env.local` (never commit this file).

## Running the schema

1. Go to your Supabase dashboard → SQL Editor → New query
2. Paste the full contents of `schema.sql`
3. Click Run

The schema is safe to run multiple times — it uses `CREATE TABLE IF NOT EXISTS` and
`ADD COLUMN IF NOT EXISTS` throughout.

If you have already run the initial schema, only the **Migrations** section at the bottom
contains new statements. You can run just those lines if needed.

## Tables

| Table | Purpose |
|---|---|
| `universities` | Seed data — Western University pre-seeded |
| `users` | Reserved for future Supabase Auth integration |
| `tutors` | Tutor profiles — `is_approved = false` by default |
| `tutor_courses` | One row per course per tutor |
| `student_requests` | Requests submitted when no tutor is listed |
| `contact_requests` | Contact form submissions from students to tutors |
| `reviews` | Tutor reviews — `is_approved = false` by default |
| `courses` | Reserved for future course directory import |
| `admin_actions` | Reserved for future admin audit log |

## Key defaults

- Tutors are not visible publicly until `is_approved = true` and `is_active = true`
- Reviews are not shown publicly until `is_approved = true`
- `tutor_id` in `contact_requests` is nullable — demo tutor submissions set it to null

## What is not production-ready

- `/admin` has no authentication — protect before deploying publicly
- No email sending — notifications are manual for now
- No Supabase Auth — user accounts not implemented yet
- No RLS policies for admin reads — service role key bypasses RLS (server-side only)
