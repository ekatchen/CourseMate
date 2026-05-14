import { supabase, supabaseAdmin } from "./supabaseClient";
import { Tutor, getAverageRating, matchesCourseQuery, tutors as staticTutors } from "./data";

// ─── Supabase row types ───────────────────────────────────────────────────────

export type SupabaseTutorCourse = {
  id: string;
  manual_course_code: string;
  manual_course_name: string | null;
  grade_received: string | null;
  rate_per_hour: number | null;
};

export type SupabaseReview = {
  id: string;
  student_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type SupabaseTutor = {
  id: string;
  display_name: string;
  program: string | null;
  year: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  average_rating: number;
  review_count: number;
  tutor_courses: SupabaseTutorCourse[];
  reviews: SupabaseReview[];
};

export type TutorApplicationPayload = {
  display_name: string;
  email: string;
  program: string;
  year: string;
  bio: string;
  university_name: string;
  academic_integrity_agreed: boolean;
  courses: {
    code: string;
    name: string;
    rate: string;
    grade: string;
  }[];
};

export type StudentRequestPayload = {
  student_name: string;
  student_email: string;
  manual_course_code: string;
  manual_course_name: string;
  help_needed: string;
  academic_integrity_agreed: boolean;
};

// ─── Map Supabase → Tutor (used by existing components) ──────────────────────

function mapSupabaseTutor(row: SupabaseTutor): Tutor {
  const courses = (row.tutor_courses ?? []).map((c) => ({
    code: c.manual_course_code,
    name: c.manual_course_name ?? c.manual_course_code,
    ratePerHour: c.rate_per_hour ?? 0,
    grade: c.grade_received ?? undefined,
  }));

  const reviews = (row.reviews ?? []).map((r) => ({
    id: r.id,
    reviewerName: r.student_name ?? "Anonymous",
    rating: r.rating,
    comment: r.comment ?? "",
    date: r.created_at.slice(0, 10),
  }));

  return {
    id: row.id,
    name: row.display_name,
    program: row.program ?? "",
    year: row.year ?? "",
    bio: row.bio ?? "",
    photoUrl:
      row.profile_photo_url ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.display_name)}`,
    courses,
    reviews,
    status: "approved",
  };
}

// ─── Fetch approved tutors (with optional search) ────────────────────────────

export async function fetchApprovedTutors(query?: string): Promise<Tutor[]> {
  if (!supabase) {
    // Supabase not configured — use static demo data
    const approved = staticTutors.filter((t) => t.status === "approved");
    if (!query) return approved;
    return approved.filter((t) =>
      t.courses.some((c) => matchesCourseQuery(query, c.code, c.name))
    );
  }

  const { data, error } = await supabase
    .from("tutors")
    .select(
      `id, display_name, program, year, bio, profile_photo_url, average_rating, review_count,
       tutor_courses(id, manual_course_code, manual_course_name, grade_received, rate_per_hour),
       reviews!inner(id, student_name, rating, comment, created_at)`
    )
    .eq("is_approved", true)
    .eq("is_active", true)
    .eq("reviews.is_approved", true)
    .order("average_rating", { ascending: false });

  if (error) {
    console.error("[fetchApprovedTutors]", error.message);
    // Fall back to static data on error
    return staticTutors.filter((t) => t.status === "approved");
  }

  const mapped = (data as SupabaseTutor[]).map(mapSupabaseTutor);

  if (!query) return mapped;
  return mapped.filter((t) =>
    t.courses.some((c) => matchesCourseQuery(query, c.code, c.name))
  );
}

// ─── Submit tutor application ─────────────────────────────────────────────────

export async function submitTutorApplication(
  payload: TutorApplicationPayload
): Promise<{ error: string | null }> {
  if (!supabase) {
    console.warn("Supabase not configured — tutor application not saved.");
    return { error: null }; // succeed silently in dev
  }

  const lowestRate = payload.courses.reduce((min, c) => {
    const r = parseFloat(c.rate);
    return r < min ? r : min;
  }, Infinity);

  const { data: tutor, error: tutorError } = await supabase
    .from("tutors")
    .insert({
      display_name: payload.display_name,
      email: payload.email,
      program: payload.program,
      year: payload.year,
      bio: payload.bio,
      university_name: payload.university_name,
      hourly_rate: isFinite(lowestRate) ? lowestRate : null,
      is_approved: false,
      is_active: true,
      academic_integrity_agreed: payload.academic_integrity_agreed,
    })
    .select("id")
    .single();

  if (tutorError) {
    console.error("[submitTutorApplication] tutor insert:", tutorError.message);
    return { error: "Something went wrong submitting your application. Please try again." };
  }

  const courseRows = payload.courses.map((c) => ({
    tutor_id: tutor.id,
    manual_course_code: c.code.trim(),
    manual_course_name: c.name.trim() || null,
    grade_received: c.grade.trim() || null,
    rate_per_hour: parseFloat(c.rate) || null,
  }));

  const { error: coursesError } = await supabase
    .from("tutor_courses")
    .insert(courseRows);

  if (coursesError) {
    console.error("[submitTutorApplication] courses insert:", coursesError.message);
    // Non-fatal — tutor row was saved; admin can add courses manually
  }

  return { error: null };
}

// ─── Submit student request ───────────────────────────────────────────────────

export async function submitStudentRequest(
  payload: StudentRequestPayload
): Promise<{ error: string | null }> {
  if (!supabase) {
    console.warn("Supabase not configured — student request not saved.");
    return { error: null };
  }

  const { error } = await supabase.from("student_requests").insert({
    student_name: payload.student_name,
    student_email: payload.student_email,
    manual_course_code: payload.manual_course_code.trim(),
    manual_course_name: payload.manual_course_name.trim() || null,
    help_needed: payload.help_needed.trim() || null,
    academic_integrity_agreed: payload.academic_integrity_agreed,
    status: "new",
  });

  if (error) {
    console.error("[submitStudentRequest]", error.message);
    return { error: "Something went wrong submitting your request. Please try again." };
  }

  return { error: null };
}

// ─── Admin queries (server-side only, uses service role) ─────────────────────

export async function fetchPendingTutors() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("tutors")
    .select("id, display_name, email, program, year, bio, created_at, tutor_courses(manual_course_code, rate_per_hour)")
    .eq("is_approved", false)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) { console.error("[fetchPendingTutors]", error.message); return []; }
  return data ?? [];
}

export async function fetchStudentRequests() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("student_requests")
    .select("id, student_name, student_email, manual_course_code, help_needed, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) { console.error("[fetchStudentRequests]", error.message); return []; }
  return data ?? [];
}

export async function fetchPendingReviews() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, student_name, rating, comment, created_at, tutor_id, tutors(display_name)")
    .eq("is_approved", false)
    .order("created_at", { ascending: false });
  if (error) { console.error("[fetchPendingReviews]", error.message); return []; }
  return data ?? [];
}

export async function approveTutor(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("tutors").update({ is_approved: true }).eq("id", id);
}

export async function rejectTutor(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("tutors").update({ is_active: false }).eq("id", id);
}

export async function approveReview(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("reviews").update({ is_approved: true }).eq("id", id);
}
