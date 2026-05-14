"use server";

import {
  approveTutor,
  rejectTutor,
  approveReview,
  markRequestMatched,
  markRequestClosed,
  closeContactRequest,
} from "@/lib/queries";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendApprovalNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function handleApproveTutor(formData: FormData) {
  const id = formData.get("id") as string;
  await approveTutor(id);

  // Send approval email (fire-and-forget)
  if (supabaseAdmin) {
    supabaseAdmin
      .from("tutors")
      .select("email, display_name")
      .eq("id", id)
      .single()
      .then((result: { data: { email: string; display_name: string } | null }) => {
        if (result.data?.email) {
          sendApprovalNotification({
            tutorEmail: result.data.email,
            tutorName: result.data.display_name,
          }).catch(console.error);
        }
      });
  }

  revalidatePath("/admin");
}

export async function handleRejectTutor(formData: FormData) {
  const id = formData.get("id") as string;
  await rejectTutor(id);
  revalidatePath("/admin");
}

export async function handleApproveReview(formData: FormData) {
  const id = formData.get("id") as string;
  await approveReview(id);
  revalidatePath("/admin");
}

export async function handleMarkMatched(formData: FormData) {
  const id = formData.get("id") as string;
  await markRequestMatched(id);
  revalidatePath("/admin");
}

export async function handleMarkClosed(formData: FormData) {
  const id = formData.get("id") as string;
  await markRequestClosed(id);
  revalidatePath("/admin");
}

export async function handleCloseContact(formData: FormData) {
  const id = formData.get("id") as string;
  await closeContactRequest(id);
  revalidatePath("/admin");
}
