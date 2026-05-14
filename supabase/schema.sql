-- CourseMate — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to run multiple times — uses IF NOT EXISTS and DO blocks.

-- ─── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ─── universities ─────────────────────────────────────────────────────────────

create table if not exists universities (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  short_name        text,
  domain            text,
  city              text,
  province_state    text,
  country           text default 'Canada',
  created_at        timestamptz default now()
);

-- Seed: Western University
insert into universities (name, short_name, domain, city, province_state)
values ('Western University', 'Western', 'uwo.ca', 'London', 'Ontario')
on conflict do nothing;

-- ─── users ────────────────────────────────────────────────────────────────────
-- References auth.users if Supabase Auth is enabled. Kept simple for MVP.

create table if not exists users (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  full_name         text,
  university_id     uuid references universities(id) on delete set null,
  role              text check (role in ('student', 'tutor', 'admin')) default 'student',
  created_at        timestamptz default now()
);

-- ─── courses ──────────────────────────────────────────────────────────────────
-- Kept lightweight for MVP. Manual entry is allowed; course_id is optional.

create table if not exists courses (
  id                uuid primary key default gen_random_uuid(),
  university_id     uuid references universities(id) on delete set null,
  course_code       text not null,
  course_name       text,
  description       text,
  level             text,
  credits           text,
  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ─── tutors ───────────────────────────────────────────────────────────────────

create table if not exists tutors (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references users(id) on delete set null,
  display_name              text not null,
  email                     text not null,
  university_id             uuid references universities(id) on delete set null,
  university_name           text,
  program                   text,
  year                      text,
  bio                       text,
  teaching_style            text,
  hourly_rate               numeric,
  session_format            text check (session_format in ('online', 'in_person', 'both')),
  profile_photo_url         text,
  availability_text         text,
  academic_integrity_agreed boolean default false,
  is_approved               boolean default false,
  is_verified               boolean default false,
  is_active                 boolean default true,
  average_rating            numeric default 0,
  review_count              integer default 0,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

-- ─── tutor_courses ────────────────────────────────────────────────────────────
-- course_id is nullable — tutors may type a course not yet in the courses table.

create table if not exists tutor_courses (
  id                  uuid primary key default gen_random_uuid(),
  tutor_id            uuid references tutors(id) on delete cascade not null,
  course_id           uuid references courses(id) on delete set null,
  manual_course_code  text not null,
  manual_course_name  text,
  grade_received      text,
  rate_per_hour       numeric,
  description         text,
  is_grade_verified   boolean default false,
  created_at          timestamptz default now()
);

-- ─── student_requests ────────────────────────────────────────────────────────

create table if not exists student_requests (
  id                        uuid primary key default gen_random_uuid(),
  student_name              text not null,
  student_email             text not null,
  university_id             uuid references universities(id) on delete set null,
  university_name           text,
  course_id                 uuid references courses(id) on delete set null,
  manual_course_code        text not null,
  manual_course_name        text,
  help_needed               text,
  budget                    numeric,
  urgency                   text check (urgency in ('this_week', 'before_midterm', 'before_final', 'flexible')),
  preferred_format          text check (preferred_format in ('online', 'in_person', 'either')),
  preferred_times           text,
  academic_integrity_agreed boolean default false,
  status                    text check (status in ('new', 'matched', 'closed')) default 'new',
  created_at                timestamptz default now()
);

-- ─── reviews ──────────────────────────────────────────────────────────────────

create table if not exists reviews (
  id             uuid primary key default gen_random_uuid(),
  tutor_id       uuid references tutors(id) on delete cascade not null,
  student_name   text,
  student_email  text,
  rating         integer check (rating >= 1 and rating <= 5) not null,
  comment        text,
  is_approved    boolean default false,
  created_at     timestamptz default now()
);

-- ─── contact_requests ────────────────────────────────────────────────────────

create table if not exists contact_requests (
  id                 uuid primary key default gen_random_uuid(),
  tutor_id           uuid references tutors(id) on delete cascade not null,
  student_name       text not null,
  student_email      text not null,
  message            text,
  course_id          uuid references courses(id) on delete set null,
  manual_course_code text,
  status             text check (status in ('new', 'sent', 'responded', 'closed')) default 'new',
  created_at         timestamptz default now()
);

-- ─── admin_actions ────────────────────────────────────────────────────────────

create table if not exists admin_actions (
  id              uuid primary key default gen_random_uuid(),
  admin_user_id   uuid references users(id) on delete set null,
  action_type     text not null,
  target_type     text,
  target_id       uuid,
  notes           text,
  created_at      timestamptz default now()
);

-- ─── Future tables (stubs — uncomment when needed) ───────────────────────────
--
-- create table if not exists faculties ( ... );
-- create table if not exists departments ( ... );
-- create table if not exists programs ( ... );
-- create table if not exists program_courses ( ... );
-- create table if not exists bookings ( ... );
-- create table if not exists payments ( ... );

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table universities       enable row level security;
alter table users              enable row level security;
alter table courses            enable row level security;
alter table tutors             enable row level security;
alter table tutor_courses      enable row level security;
alter table student_requests   enable row level security;
alter table reviews            enable row level security;
alter table contact_requests   enable row level security;
alter table admin_actions      enable row level security;

-- universities: public read
create policy "universities_public_read"
  on universities for select using (true);

-- courses: public read of active courses
create policy "courses_public_read"
  on courses for select using (is_active = true);

-- tutors: public can read approved + active tutors
create policy "tutors_public_read"
  on tutors for select using (is_approved = true and is_active = true);

-- tutors: anyone can apply (insert)
create policy "tutors_public_insert"
  on tutors for insert with check (true);

-- tutor_courses: public read (for approved tutors)
create policy "tutor_courses_public_read"
  on tutor_courses for select using (true);

-- tutor_courses: anyone can insert (tutor application)
create policy "tutor_courses_public_insert"
  on tutor_courses for insert with check (true);

-- student_requests: anyone can submit
create policy "student_requests_public_insert"
  on student_requests for insert with check (true);

-- reviews: public can read approved reviews
create policy "reviews_public_read"
  on reviews for select using (is_approved = true);

-- contact_requests: anyone can submit
create policy "contact_requests_public_insert"
  on contact_requests for insert with check (true);

-- ─── Helper: update tutor average_rating after review changes ────────────────

create or replace function update_tutor_rating()
returns trigger language plpgsql as $$
begin
  update tutors
  set
    average_rating = (
      select round(avg(rating)::numeric, 1)
      from reviews
      where tutor_id = coalesce(new.tutor_id, old.tutor_id)
        and is_approved = true
    ),
    review_count = (
      select count(*)
      from reviews
      where tutor_id = coalesce(new.tutor_id, old.tutor_id)
        and is_approved = true
    ),
    updated_at = now()
  where id = coalesce(new.tutor_id, old.tutor_id);
  return new;
end;
$$;

create or replace trigger trg_update_tutor_rating
  after insert or update or delete on reviews
  for each row execute function update_tutor_rating();

-- ─── Migrations (run after initial schema) ───────────────────────────────────
-- Safe to run multiple times. Add new columns here as the product evolves.

-- tutors: availability and booking fields
alter table tutors add column if not exists calendly_url               text;
alter table tutors add column if not exists campus_location_preference text;
alter table tutors add column if not exists online_meeting_preference  text;

-- contact_requests: additional fields + make tutor_id nullable for demo tutors
alter table contact_requests alter column tutor_id drop not null;
alter table contact_requests add column if not exists tutor_name       text;
alter table contact_requests add column if not exists preferred_format text;
alter table contact_requests add column if not exists preferred_times  text;

-- RLS policy for contact_requests public insert (if not already created)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'contact_requests' and policyname = 'contact_requests_public_insert'
  ) then
    execute 'create policy "contact_requests_public_insert"
      on contact_requests for insert with check (true)';
  end if;
end $$;
