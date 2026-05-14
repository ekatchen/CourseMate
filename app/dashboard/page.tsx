import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = user.user_metadata?.role ?? "student";
  redirect(role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
}
