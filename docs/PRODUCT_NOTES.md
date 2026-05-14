# Product Notes

## Demo data

`lib/data.ts` contains 6 fake tutors used as demo/fallback data.
They appear in the public directory when:
- Supabase is not configured, OR
- Supabase returns zero approved tutors

Once real tutors are approved via the admin page, `fetchApprovedTutors`
will return live data instead and demo tutors will no longer appear.

Demo review text follows neutral guidelines — no overclaiming:
- "Clear explanations and useful practice questions."
- "Helpful for reviewing difficult concepts."
- "Good at breaking down weekly material."

Do not use: "best tutor at Western", "raised my grade", "knows exactly what's on the exam".

## Course codes

All course entries are manual. `manual_course_code` is a free-text field.
`course_id` is nullable — courses don't need to exist in the `courses` table.
The search in `matchesCourseQuery()` normalizes spacing so "CS1026" matches "CS 1026".

## University affiliation

CourseMate is not affiliated with or endorsed by Western University.
Do not use "official", "Western-approved", or similar language anywhere in the UI.

## Business model

Free for both students and tutors during MVP. No platform fee, no commission.
If monetization is introduced later, it will be optional and announced in advance.

## Admin page

`/admin` has no authentication. It must be protected before going to production.
Options: Supabase Auth, middleware-based password, or moving to a private URL.

## Key files

| File | Purpose |
|---|---|
| `lib/data.ts` | Static demo tutor data |
| `lib/queries.ts` | All Supabase read/write functions |
| `lib/supabaseClient.ts` | Supabase client init with graceful null fallback |
| `supabase/schema.sql` | Full DB schema — run once in SQL Editor |
| `app/admin/page.tsx` | Admin dashboard (server component) |
| `app/admin/actions.ts` | Server actions for admin operations |
