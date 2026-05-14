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

export default async function StudentDashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = user.email!;
  const name = (user.user_metadata?.full_name ?? email.split("@")[0]) as string;

  let requests: {
    id: string;
    tutor_name: string | null;
    manual_course_code: string;
    preferred_format: string | null;
    message: string | null;
    status: string;
    created_at: string;
  }[] = [];

  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("contact_requests")
      .select(
        "id, tutor_name, manual_course_code, preferred_format, message, status, created_at"
      )
      .eq("student_email", email)
      .order("created_at", { ascending: false })
      .limit(20);
    requests = data ?? [];
  }

  const totalRequests = requests.length;
  const uniqueTutors = new Set(requests.map((r) => r.tutor_name).filter(Boolean)).size;
  const awaitingReply = requests.filter((r) => r.status === "new").length;

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {name.split(" ")[0]}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&rsquo;s a summary of your tutor requests.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Requests Sent
          </p>
          <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Tutors Contacted
          </p>
          <p className="text-3xl font-bold text-gray-900">{uniqueTutors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Awaiting Reply
          </p>
          <p className="text-3xl font-bold text-brand-700">{awaitingReply}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          href="/tutors"
          className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl p-4 transition-colors"
        >
          <p className="text-sm font-semibold">Find a Tutor</p>
          <p className="text-xs text-white/70 mt-0.5">
            Search by course code
          </p>
        </Link>
        <Link
          href="/request-a-tutor"
          className="bg-white border border-gray-200 hover:border-brand-200 rounded-xl p-4 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900">
            Request a Course
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            No tutor listed yet
          </p>
        </Link>
      </div>

      {/* Request history */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Request History
        </h2>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-1">
              You haven&rsquo;t contacted any tutors yet.
            </p>
            <p className="text-xs text-gray-400 mb-5">
              Search for a tutor and send a request to get started.
            </p>
            <Link
              href="/tutors"
              className="bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Find a Tutor
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">
                      {req.manual_course_code}
                    </p>
                    {req.tutor_name && (
                      <span className="text-xs text-gray-400">
                        &rarr; {req.tutor_name}
                      </span>
                    )}
                    {req.preferred_format && (
                      <span className="text-xs text-gray-300">
                        &middot; {req.preferred_format.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  {req.message && (
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-sm">
                      {req.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(req.created_at).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    statusStyle[req.status] ?? "bg-gray-100 text-gray-500"
                  }`}
                >
                  {statusLabel[req.status] ?? req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
