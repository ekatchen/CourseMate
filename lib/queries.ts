import { supabase, supabaseAdmin } from "./supabaseClient";
import { Tutor, matchesCourseQuery, tutors as staticTutors } from "./data";
import { sendContactNotification } from "./email";

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
  is_approved: boolean;
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
  session_format: string | null;
  availability_text: string | null;
  teaching_style: string | null;
  calendly_url: string | null;
  campus_location_preference: string | null;
  online_meeting_preference: string | null;
  tutor_courses: SupabaseTutorCourse[];
  reviews: SupabaseReview[];
};

export type TutorApplicationPayload = {
  display_name: string;
  email: string;
  program: string;
  year: string;
  bio: string;
  teaching_style: string;
  session_format: "online" | "in_person" | "both";
  availability_text: string;
  calendly_url: string;
  campus_location_preference: string;
  online_meeting_preference: string;
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
  budget: string;
  urgency: "this_week" | "before_midterm" | "before_final" | "flexible";
  preferred_format: "online" | "in_person" | "either";
  preferred_times: string;
  academic_integrity_agreed: boolean;
};

export type ContactRequestPayload = {
  tutor_id: string;
  tutor_name: string;
  student_name: string;
  student_email: string;
  manual_course_code: string;
  preferred_format: "online" | "in_person" | "either";
  preferred_times: string;
  message: string;
};

// ─── Map Supabase → Tutor (used by existing components) ──────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapSupabaseTutor(row: SupabaseTutor): Tutor {
  const courses = (row.tutor_courses ?? []).map((c) => ({
    code: c.manual_course_code,
    name: c.manual_course_name ?? c.manual_course_code,
    ratePerHour: c.rate_per_hour ?? 0,
    grade: c.grade_received ?? undefined,
  }));

  // Only include approved reviews (left join — filter here)
  const reviews = (row.reviews ?? [])
    .filter((r) => r.is_approved)
    .map((r) => ({
      id: r.id,
      reviewerName: r.student_name ?? "Anonymous",
      rating: r.rating,
      comment: r.comment ?? "",
      date: r.created_at.slice(0, 10),
    }));

  const sessionFormat = (row.session_format as Tutor["sessionFormat"]) ?? undefined;

  // Only show Calendly URL if it's a valid https link
  const calendlyUrl =
    row.calendly_url && row.calendly_url.startsWith("https://")
      ? row.calendly_url
      : undefined;

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
    sessionFormat,
    availabilityText: row.availability_text ?? undefined,
    teachingStyle: row.teaching_style ?? undefined,
    calendlyUrl,
    campusLocationPreference: row.campus_location_preference ?? undefined,
    onlineMeetingPreference: row.online_meeting_preference ?? undefined,
  };
}

// ─── Fetch approved tutors (with optional search) ────────────────────────────
// Falls back to static demo data if Supabase is not configured or has no live tutors yet.
// Once real tutors are approved via /admin, they replace demo data automatically.

export async function fetchApprovedTutors(query?: string): Promise<Tutor[]> {
  if (!supabase) {
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
       session_format, availability_text, teaching_style, calendly_url,
       campus_location_preference, online_meeting_preference,
       tutor_courses(id, manual_course_code, manual_course_name, grade_received, rate_per_hour),
       reviews(id, student_name, rating, comment, is_approved, created_at)`
    )
    .eq("is_approved", true)
    .eq("is_active", true)
    .order("average_rating", { ascending: false });

  if (error) {
    console.error("[fetchApprovedTutors]", error.message);
    return staticTutors.filter((t) => t.status === "approved");
  }

  if (!data || data.length === 0) {
    const approved = staticTutors.filter((t) => t.status === "approved");
    if (!query) return approved;
    return approved.filter((t) =>
      t.courses.some((c) => matchesCourseQuery(query, c.code, c.name))
    );
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
    return { error: null };
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
      teaching_style: payload.teaching_style || null,
      session_format: payload.session_format,
      availability_text: payload.availability_text || null,
      calendly_url: payload.calendly_url || null,
      campus_location_preference: payload.campus_location_preference || null,
      online_meeting_preference: payload.online_meeting_preference || null,
      university_name: payload.university_name,
      hourly_rate: isFinite(lowestRate) ? lowestRate : null,
      is_approved: false,
      is_active: true,
      is_verified: false,
      academic_integrity_agreed: payload.academic_integrity_agreed,
    })
    .select("id")
    .single();

  if (tutorError) {
    console.error("[submitTutorApplication] tutor insert:", tutorError.message);
    return { error: "Something went wrong. Please try again." };
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
    budget: payload.budget ? parseFloat(payload.budget) : null,
    urgency: payload.urgency,
    preferred_format: payload.preferred_format,
    preferred_times: payload.preferred_times.trim() || null,
    academic_integrity_agreed: payload.academic_integrity_agreed,
    university_name: "Western University",
    status: "new",
  });

  if (error) {
    console.error("[submitStudentRequest]", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  return { error: null };
}

// ─── Submit contact request ───────────────────────────────────────────────────

export async function submitContactRequest(
  payload: ContactRequestPayload
): Promise<{ error: string | null }> {
  if (!supabase) {
    console.warn("Supabase not configured — contact request not saved.");
    return { error: null };
  }

  // tutor_id must be a real UUID; demo tutors (id = "1", "2") get null
  const tutorIdValue = UUID_RE.test(payload.tutor_id) ? payload.tutor_id : null;

  const { error } = await supabase.from("contact_requests").insert({
    tutor_id: tutorIdValue,
    tutor_name: payload.tutor_name,
    student_name: payload.student_name,
    student_email: payload.student_email,
    manual_course_code: payload.manual_course_code.trim(),
    preferred_format: payload.preferred_format,
    preferred_times: payload.preferred_times.trim() || null,
    message: payload.message.trim() || null,
    status: "new",
  });

  if (error) {
    console.error("[submitContactRequest]", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  // Send email notification to tutor (fire-and-forget)
  if (tutorIdValue && supabaseAdmin) {
    supabaseAdmin
      .from("tutors")
      .select("email")
      .eq("id", tutorIdValue)
      .single()
      .then(({ data }) => {
        if (data?.email) {
          sendContactNotification({
            tutorEmail: data.email,
            tutorName: payload.tutor_name,
            studentName: payload.student_name,
            studentEmail: payload.student_email,
            courseCode: payload.manual_course_code,
            preferredFormat: payload.preferred_format,
            preferredTimes: payload.preferred_times,
            message: payload.message,
          }).catch(console.error);
        }
      });
  }

  return { error: null };
}

// ─── Admin queries (server-side only, uses service role) ─────────────────────

export async function fetchPendingTutors() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("tutors")
    .select("id, display_name, email, program, year, bio, teaching_style, session_format, availability_text, calendly_url, created_at, tutor_courses(manual_course_code, rate_per_hour)")
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
    .select("id, student_name, student_email, manual_course_code, help_needed, urgency, preferred_format, budget, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) { console.error("[fetchStudentRequests]", error.message); return []; }
  return data ?? [];
}

export async function fetchContactRequests() {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from("contact_requests")
    .select("id, tutor_name, student_name, student_email, manual_course_code, preferred_format, preferred_times, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) { console.error("[fetchContactRequests]", error.message); return []; }
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

export async function markRequestMatched(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("student_requests").update({ status: "matched" }).eq("id", id);
}

export async function markRequestClosed(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("student_requests").update({ status: "closed" }).eq("id", id);
}

export async function closeContactRequest(id: string): Promise<void> {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("contact_requests").update({ status: "closed" }).eq("id", id);
}
