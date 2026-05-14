import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function adminLoginAction(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return;
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", adminPassword, {
      httpOnly: true,
      path: "/admin",
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: "strict",
    });
    redirect("/admin");
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">CourseMate Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              Incorrect password.
            </div>
          )}

          <form action={adminLoginAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
