import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  new: "New",
  sent: "Sent",
  responded: "Responded",
  closed: "Closed",
};

const statusStyle: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  sent: "bg-brand-50 text-brand-700",
  responded: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

type TutorProfile = {
  id: string;
  display_name: string;
  program: string | null;
  year: string | null;
  is_approved: boolean;
  average_rating: number;
  review_count: number;
  session_format: string | null;
};

type InboxItem = {
  id: string;
  student_name: string;
  student_email: string;
  manual_course_code: string;
  preferred_format: string | null;
  preferred_times: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function TutorDashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = user.email!;
  const name = (user.user_metadata?.full_name ?? email.split("@")[0]) as string;

  let tutorProfile: TutorProfile | null = null;
  let inbox: InboxItem[] = [];

  if (supabaseAdmin) {
    const { data: tutor } = await supabaseAdmin
      .from("tutors")
      .select(
        "id, display_name, program, year, is_approved, average_rating, review_count, session_format"
      )
      .eq("email", email)
      .maybeSingle();

    tutorProfile = tutor;

    if (tutor?.id) {
      const { data: requests } = await supabaseAdmin
        .from("contact_requests")
        .select(
          "id, student_name, student_email, manual_course_code, preferred_format, preferred_times, message, status, created_at"
        )
        .eq("tutor_id", tutor.id)
        .order("created_at", { ascending: false })
        .limit(20);
      inbox = requests ?? [];
    }
  }

  const displayName = tutorProfile?.display_name ?? name;
  const newRequests = inbox.filter((r) => r.status === "new").length;

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {displayName.split(" ")[0]}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your student requests and profile.
          </p>
        </div>
        {tutorProfile && (
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              tutorProfile.is_approved
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {tutorProfile.is_approved ? "Profile Active" : "Pending Review"}
          </span>
        )}
      </div>

      {/* No profile yet */}
      {!tutorProfile && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-1">
            No tutor profile found
          </p>
          <p className="text-sm text-gray-500 mb-5">
            Apply to list your courses and start receiving student requests.
            We&rsquo;ll review your application within 24 hours.
          </p>
          <Link
            href="/become-a-tutor"
            className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Apply to Tutor
          </Link>
        </div>
      )}

      {/* Stats */}
      {tutorProfile && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              New Requests
            </p>
            <p className="text-3xl font-bold text-brand-700">{newRequests}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Total Requests
            </p>
            <p className="text-3xl font-bold text-gray-900">{inbox.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Rating
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {tutorProfile.average_rating > 0
                ? tutorProfile.average_rating.toFixed(1)
                : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      {tutorProfile && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href={`/tutors/${tutorProfile.id}`}
            className="bg-white border border-gray-200 hover:border-brand-200 rounded-xl p-4 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">
              View My Profile
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              See how students see you
            </p>
          </Link>
          <Link
            href="/become-a-tutor"
            className="bg-white border border-gray-200 hover:border-brand-200 rounded-xl p-4 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">Edit Profile</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Update courses &amp; availability
            </p>
          </Link>
        </div>
      )}

      {/* Inbox */}
      {tutorProfile && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Student Inbox
          </h2>

          {inbox.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <p className="text-gray-500 text-sm mb-1">No requests yet.</p>
              <p className="text-xs text-gray-400">
                {tutorProfile.is_approved
                  ? "Students can find your profile and send requests."
                  : "Once your profile is approved, requests will appear here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {inbox.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {req.student_name?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {req.student_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {req.student_email}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                            {req.manual_course_code}
                          </span>
                          {req.preferred_format && (
                            <span className="text-xs text-gray-400">
                              {req.preferred_format.replace("_", " ")}
                            </span>
                          )}
                          {req.preferred_times && (
                            <span className="text-xs text-gray-400">
                              &middot; {req.preferred_times}
                            </span>
                          )}
                        </div>
                        {req.message && (
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {req.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-300 mt-2">
                          {new Date(req.created_at).toLocaleDateString(
                            "en-CA",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        statusStyle[req.status] ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {statusLabel[req.status] ?? req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
