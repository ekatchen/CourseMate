import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM =
  process.env.RESEND_FROM_EMAIL ?? "CourseMate <onboarding@resend.dev>";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─── Student contacts a tutor ─────────────────────────────────────────────────

export async function sendContactNotification({
  tutorEmail,
  tutorName,
  studentName,
  studentEmail,
  courseCode,
  preferredFormat,
  preferredTimes,
  message,
}: {
  tutorEmail: string;
  tutorName: string;
  studentName: string;
  studentEmail: string;
  courseCode: string;
  preferredFormat?: string | null;
  preferredTimes?: string | null;
  message?: string | null;
}) {
  if (!resend) return;

  const lines = [
    `Hi ${tutorName},`,
    ``,
    `A student has reached out to you for ${courseCode} tutoring on CourseMate.`,
    ``,
    `Student: ${studentName}`,
    `Email: ${studentEmail}`,
    `Course: ${courseCode}`,
    preferredFormat ? `Format: ${preferredFormat.replace(/_/g, " ")}` : null,
    preferredTimes ? `Availability: ${preferredTimes}` : null,
    message ? `\nMessage:\n${message}` : null,
    ``,
    `Reply directly to ${studentEmail} to arrange a session.`,
    ``,
    `— CourseMate`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  await resend.emails.send({
    from: FROM,
    to: tutorEmail,
    replyTo: studentEmail,
    subject: `New tutoring request — ${courseCode}`,
    text: lines,
  });
}

// ─── New tutor application → notify admin ─────────────────────────────────────

export async function sendApplicationNotification({
  tutorName,
  tutorEmail,
  courses,
}: {
  tutorName: string;
  tutorEmail: string;
  courses: string[];
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return;

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New tutor application — ${tutorName}`,
    text: [
      `New tutor application received on CourseMate.`,
      ``,
      `Name: ${tutorName}`,
      `Email: ${tutorEmail}`,
      `Courses: ${courses.join(", ")}`,
      ``,
      `Review and approve at: ${SITE_URL}/admin`,
    ].join("\n"),
  });
}

// ─── Admin approves tutor → notify tutor ─────────────────────────────────────

export async function sendApprovalNotification({
  tutorEmail,
  tutorName,
}: {
  tutorEmail: string;
  tutorName: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: tutorEmail,
    subject: `Your CourseMate profile is live!`,
    text: [
      `Hi ${tutorName},`,
      ``,
      `Your CourseMate tutor profile has been approved and is now live.`,
      ``,
      `Students searching for your courses can now find and contact you directly.`,
      ``,
      `View your profile: ${SITE_URL}/tutors`,
      ``,
      `— CourseMate`,
    ].join("\n"),
  });
}
