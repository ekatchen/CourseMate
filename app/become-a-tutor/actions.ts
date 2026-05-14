"use server";

import { submitTutorApplication, TutorApplicationPayload } from "@/lib/queries";
import { sendApplicationNotification } from "@/lib/email";

export async function submitTutorApplicationAction(
  payload: TutorApplicationPayload
): Promise<{ error: string | null }> {
  const result = await submitTutorApplication(payload);

  if (!result.error) {
    sendApplicationNotification({
      tutorName: payload.display_name,
      tutorEmail: payload.email,
      courses: payload.courses.map((c) => c.code),
    }).catch(console.error);
  }

  return result;
}
