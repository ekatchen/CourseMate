# CourseMate

Course-specific peer tutoring for university students.

Students search by exact course code, compare peer tutors, and contact them directly. Tutors apply to list the courses they can help with, set their own rate, and receive student requests.

**Status:** Early MVP — Western University, no payments, no scheduling, contact by email.

---

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript
- **Fonts:** Geist (via next/font)

---

## Features

- Course-code search with fuzzy matching (`CS1026` → `CS 1026`, `calc` → `Calc 1000`)
- Tutor directory with rating/rate sort and session format filter
- Tutor profile pages with availability, Calendly link, and course list
- Contact tutor form — saves to Supabase, forwarded by email
- Tutor application form — reviewed manually before going live
- Student request form — logged when no tutor exists for a course
- Admin dashboard — approve/reject applications, manage requests, approve reviews
- Static demo data as fallback while the tutor directory is building
- How it Works and About pages

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage with course search |
| `/tutors` | Tutor directory with search, sort, format filter |
| `/tutors/[id]` | Individual tutor profile |
| `/become-a-tutor` | Tutor application form |
| `/request-a-tutor` | Student request form (no tutor listed) |
| `/how-it-works` | Detailed how it works + business model |
| `/about` | About page |
| `/admin` | Admin dashboard (unprotected — secure before production) |

---

## Local setup

**Prerequisites:** Node.js 18+

```bash
# 1. Clone and install
git clone https://github.com/ekatchen/CourseMate.git
cd CourseMate
npm install

# 2. Add environment variables
cp .env.example .env.local
# Fill in your Supabase URL and keys in .env.local

# 3. Run the schema
# Paste supabase/schema.sql into Supabase SQL Editor and run it

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs without Supabase — forms will silently succeed and the tutor directory shows demo data. Add Supabase credentials to enable real data persistence.

---

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

See `supabase/README.md` for full setup instructions.

---

## Project structure

```
app/
  page.tsx                  # Homepage
  tutors/
    page.tsx                # Tutor directory
    [id]/page.tsx           # Tutor profile
  become-a-tutor/page.tsx   # Tutor application
  request-a-tutor/page.tsx  # Student request
  how-it-works/page.tsx
  about/page.tsx
  admin/
    page.tsx                # Admin dashboard
    actions.ts              # Server actions

components/
  Navbar.tsx
  Footer.tsx
  TutorCard.tsx
  ContactForm.tsx           # Contact tutor form (client component)
  StarRating.tsx

lib/
  data.ts                   # Static demo tutor data + Tutor types
  queries.ts                # All Supabase read/write functions
  supabaseClient.ts         # Supabase client init

supabase/
  schema.sql                # Full DB schema — run once in SQL Editor
  README.md                 # Supabase setup guide

docs/
  ROADMAP.md
  BACKEND_SCHEMA.md
  PRODUCT_NOTES.md
```

---

## Supabase notes

- Tutors are not publicly visible until `is_approved = true` and `is_active = true`
- Reviews are not shown until `is_approved = true`
- When no approved Supabase tutors exist, the directory falls back to static demo data
- The admin page uses the service role key (server-side only) — never expose it client-side
- See `supabase/README.md` for full table reference

---

## Roadmap

See `docs/ROADMAP.md` for the full list. Short version:

- **Now:** tutor directory, contact flow, manual admin approval, demo data fallback
- **Next:** email notifications on new applications/requests, protect `/admin`
- **Later:** student/tutor dashboards, verified grades, expand to more universities
- **Not planned yet:** payments, scheduling, live chat, AI matching

---

## Academic integrity

CourseMate is for tutoring and academic support only. Tutors agree not to complete graded work on behalf of students. Both tutors and students accept this before submitting.

---

## Non-affiliation

CourseMate is an independent project and is not affiliated with, endorsed by, or officially connected to Western University or any other institution.
