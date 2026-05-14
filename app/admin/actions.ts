"use server";

import { approveTutor, rejectTutor, approveReview } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export async function handleApproveTutor(formData: FormData) {
  const id = formData.get("id") as string;
  await approveTutor(id);
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
