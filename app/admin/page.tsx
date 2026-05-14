import { fetchPendingTutors, fetchStudentRequests, fetchPendingReviews, fetchContactRequests } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  handleApproveTutor,
  handleRejectTutor,
  handleApproveReview,
  handleMarkMatched,
  handleMarkClosed,
  handleCloseContact,
} from "./actions";

export const dynamic = "force-dynamic";

const urgencyLabel: Record<string, string> = {
  this_week: "This week",
  before_midterm: "Before midterm",
  before_final: "Before final",
  flexible: "Flexible",
};

const formatLabel: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  either: "Either",
  both: "Online or in person",
};

const statusColors: Record<string, string> = {
  new: "bg-brand-50 text-brand-700",
  matched: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-400",
  sent: "bg-blue-50 text-blue-600",
  responded: "bg-green-50 text-green-700",
};

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          Supabase is not configured. Add your environment variables to{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> to enable this page.
        </p>
        <div className="text-left bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs font-mono text-gray-500 space-y-1">
          <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          <p>SUPABASE_SERVICE_ROLE_KEY=your-service-role-key</p>
        </div>
      </div>
    );
  }

  const [pendingTutors, studentRequests, contactRequests, pendingReviews] = await Promise.all([
    fetchPendingTutors(),
    fetchStudentRequests(),
    fetchContactRequests(),
    fetchPendingReviews(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Review tutor applications, student requests, contact requests, and pending reviews.</p>
        </div>
        <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg flex-shrink-0">
          Protect this route before going to production
        </span>
      </div>

      {/* Pending tutor applications */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Pending applications ({pendingTutors.length})
        </h2>
        {pendingTutors.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-5">No pending applications.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingTutors.map((t: any) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{t.display_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.email} &middot; {t.program} &middot; {t.year}
                      {t.session_format && <> &middot; {formatLabel[t.session_format] ?? t.session_format}</>}
                    </p>
                    {t.bio && <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">{t.bio}</p>}
                    {t.teaching_style && <p className="text-xs text-gray-400 mt-1 italic max-w-xl">{t.teaching_style}</p>}
                    {t.availability_text && <p className="text-xs text-gray-400 mt-1">Available: {t.availability_text}</p>}
                    {t.calendly_url && <p className="text-xs text-gray-400 mt-1">Calendly: {t.calendly_url}</p>}
                    {t.tutor_courses?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {t.tutor_courses.map((c: any) => (
                          <span key={c.manual_course_code} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                            {c.manual_course_code}{c.rate_per_hour ? ` · $${c.rate_per_hour}/hr` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-300 mt-2">Submitted {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <form action={handleApproveTutor}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 px-3 py-1.5 rounded-lg transition-colors">
                        Approve
                      </button>
                    </form>
                    <form action={handleRejectTutor}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Student requests */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Student requests ({studentRequests.length})
        </h2>
        {studentRequests.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-5">No student requests yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {studentRequests.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.manual_course_code}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.student_name} &middot; {r.student_email}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {r.urgency && (
                        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                          {urgencyLabel[r.urgency] ?? r.urgency}
                        </span>
                      )}
                      {r.preferred_format && (
                        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                          {formatLabel[r.preferred_format] ?? r.preferred_format}
                        </span>
                      )}
                      {r.budget && (
                        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                          Budget: ${r.budget}/hr
                        </span>
                      )}
                    </div>
                    {r.help_needed && <p className="text-sm text-gray-500 mt-2 max-w-xl">{r.help_needed}</p>}
                    <p className="text-xs text-gray-300 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[r.status] ?? "bg-gray-100 text-gray-400"}`}>
                      {r.status}
                    </span>
                    {r.status === "new" && (
                      <form action={handleMarkMatched}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className="text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                          Mark matched
                        </button>
                      </form>
                    )}
                    {r.status !== "closed" && (
                      <form action={handleMarkClosed}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className="text-xs text-gray-300 hover:text-gray-500 px-2 py-1 transition-colors">
                          Close
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact requests */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Contact requests ({contactRequests.length})
        </h2>
        {contactRequests.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-5">No contact requests yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {contactRequests.map((c: any) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {c.student_name} &rarr; {c.tutor_name ?? "Unknown tutor"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.student_email} &middot; {c.manual_course_code}
                      {c.preferred_format && <> &middot; {formatLabel[c.preferred_format] ?? c.preferred_format}</>}
                    </p>
                    {c.preferred_times && <p className="text-xs text-gray-400 mt-1">Available: {c.preferred_times}</p>}
                    {c.message && <p className="text-sm text-gray-500 mt-2 max-w-xl">{c.message}</p>}
                    <p className="text-xs text-gray-300 mt-2">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColors[c.status] ?? "bg-gray-100 text-gray-400"}`}>
                      {c.status}
                    </span>
                    {c.status !== "closed" && (
                      <form action={handleCloseContact}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="text-xs text-gray-300 hover:text-gray-500 px-2 py-1 transition-colors">
                          Close
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending reviews */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Pending reviews ({pendingReviews.length})
        </h2>
        {pendingReviews.length === 0 ? (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-5">No pending reviews.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingReviews.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      For {r.tutors?.display_name ?? "Unknown tutor"} &middot; {r.student_name} &middot; {r.rating}/5
                    </p>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-300 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <form action={handleApproveReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                      Approve
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
