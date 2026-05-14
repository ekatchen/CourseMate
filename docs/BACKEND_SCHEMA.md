# Backend Schema

Schema lives in `supabase/schema.sql`. Run it once in the Supabase SQL Editor.

## Tables

### `universities`
Seed data only for now. Western University is pre-seeded.

### `tutors`
One row per tutor application. Key fields:
- `is_approved` — false by default; set true via admin page
- `is_active` — set false to soft-delete/reject
- `is_verified` — reserved for future grade verification
- `teaching_style`, `session_format`, `availability_text` — shown on profile
- `hourly_rate` — auto-computed as lowest course rate on insert

### `tutor_courses`
One row per course per tutor. `course_id` is nullable — tutors type codes manually.
`manual_course_code` is the searchable field.

### `student_requests`
One row per student request. Status flow: `new` → `matched` → `closed`.
- `urgency`: `this_week | before_midterm | before_final | flexible`
- `preferred_format`: `online | in_person | either`

### `reviews`
`is_approved = false` by default. Approved via admin page. Approved reviews
auto-update `tutors.average_rating` and `tutors.review_count` via trigger.

### `contact_requests`
Not yet wired to UI. Reserved for future contact flow.

### `admin_actions`
Audit log stub. Not yet written to — reserved for future admin logging.

## RLS Policies

| Table | Public read | Public insert | Admin only |
|---|---|---|---|
| tutors | approved + active only | yes (applications) | update |
| tutor_courses | yes | yes | — |
| student_requests | no | yes | read |
| reviews | approved only | no | read + update |

## Trigger

`trg_update_tutor_rating` — fires after insert/update/delete on `reviews`.
Recalculates `average_rating` and `review_count` on the parent tutor row.
