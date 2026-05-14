import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";
  const role = user.user_metadata?.role ?? "student";
  const email = user.email ?? "";

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar name={name} role={role} email={email} />
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
