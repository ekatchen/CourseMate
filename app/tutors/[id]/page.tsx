import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTutorById, getAverageRating } from "@/lib/data";
import StarRating from "@/components/StarRating";
import ContactForm from "@/components/ContactForm";

type Props = { params: Promise<{ id: string }> };

const sessionFormatLabel: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  both: "Online or in person",
};

export default async function TutorProfilePage({ params }: Props) {
  const { id } = await params;
  const tutor = getTutorById(id);
  if (!tutor || tutor.status !== "approved") notFound();

  const avg = getAverageRating(tutor);
  const firstCourseCode = tutor.courses[0]?.code;
  const lowestRate = Math.min(...tutor.courses.map((c) => c.ratePerHour));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/tutors" className="text-sm text-gray-400 hover:text-gray-700 mb-6 inline-block transition-colors">
        &larr; Back to tutors
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Purple accent bar */}
        <div className="h-1.5 bg-brand-700 w-full" />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-brand-50 flex-shrink-0 ring-4 ring-brand-50">
              <Image src={tutor.photoUrl} alt={tutor.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
                  <p className="text-sm text-gray-400 mt-0.5">{tutor.program} &middot; {tutor.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-700">From ${lowestRate}</p>
                  <p className="text-xs text-gray-400">per hour</p>
                </div>
              </div>
              {tutor.reviews.length > 0 && (
                <div className="mt-2">
                  <StarRating rating={avg} count={tutor.reviews.length} size="md" />
                </div>
              )}
              {tutor.sessionFormat && (
                <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                  {sessionFormatLabel[tutor.sessionFormat] ?? tutor.sessionFormat}
                </span>
              )}
            </div>
          </div>
          <p className="mt-5 text-sm text-gray-600 leading-relaxed">{tutor.bio}</p>
          {tutor.teachingStyle && (
            <p className="mt-3 text-sm text-gray-400 leading-relaxed italic border-l-2 border-brand-100 pl-3">{tutor.teachingStyle}</p>
          )}
        </div>
      </div>

      {/* Availability */}
      {(tutor.availabilityText || tutor.campusLocationPreference || tutor.onlineMeetingPreference) && (
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Availability</h2>
          <div className="flex flex-col gap-1.5 text-sm text-gray-500">
            {tutor.availabilityText && <p>{tutor.availabilityText}</p>}
            {tutor.campusLocationPreference && (
              <p className="text-xs text-gray-400">In-person: {tutor.campusLocationPreference}</p>
            )}
            {tutor.onlineMeetingPreference && (
              <p className="text-xs text-gray-400">Online via: {tutor.onlineMeetingPreference}</p>
            )}
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Courses available
        </h2>
        <div className="flex flex-col gap-2">
          {tutor.courses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4 hover:border-brand-200 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{course.code}</p>
                <p className="text-xs text-gray-400 mt-0.5">{course.name}</p>
                {course.grade && (
                  <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    Grade: {course.grade}
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-brand-700">${course.ratePerHour}</p>
                <p className="text-xs text-gray-400">/ hr</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendly */}
      {tutor.calendlyUrl && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Book directly through Calendly</p>
            <p className="text-xs text-gray-400 mt-0.5">{tutor.name.split(" ")[0]} has set up a booking link.</p>
          </div>
          <a
            href={tutor.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-sm font-semibold text-brand-700 border border-brand-200 hover:bg-brand-50 px-4 py-2 rounded-lg transition-colors"
          >
            Open Calendly
          </a>
        </div>
      )}

      {/* Contact form */}
      <div className="mt-5">
        <ContactForm tutorId={tutor.id} tutorName={tutor.name} courseCodePrefill={firstCourseCode} />
      </div>

      {/* Reviews */}
      {tutor.reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Reviews ({tutor.reviews.length})
          </h2>
          <div className="flex flex-col gap-3">
            {tutor.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{review.reviewerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-300">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
