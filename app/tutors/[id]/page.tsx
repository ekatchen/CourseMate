import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTutorById, getAverageRating } from "@/lib/data";
import StarRating from "@/components/StarRating";

type Props = { params: Promise<{ id: string }> };

export default async function TutorProfilePage({ params }: Props) {
  const { id } = await params;
  const tutor = getTutorById(id);
  if (!tutor || tutor.status !== "approved") notFound();

  const avg = getAverageRating(tutor);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/tutors" className="text-sm text-gray-400 hover:text-gray-700 mb-6 inline-block transition-colors">
        &larr; Back to tutors
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-50 flex-shrink-0">
            <Image src={tutor.photoUrl} alt={tutor.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{tutor.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{tutor.program} &middot; {tutor.year}</p>
            {tutor.reviews.length > 0 && (
              <div className="mt-2">
                <StarRating rating={avg} count={tutor.reviews.length} size="md" />
              </div>
            )}
          </div>
        </div>
        <p className="mt-5 text-sm text-gray-600 leading-relaxed">{tutor.bio}</p>
      </div>

      {/* Courses */}
      <div className="mt-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Courses available
        </h2>
        <div className="flex flex-col gap-2">
          {tutor.courses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{course.code}</p>
                <p className="text-xs text-gray-400 mt-0.5">{course.name}</p>
                {course.grade && (
                  <span className="inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    Grade: {course.grade}
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-brand-700">${course.ratePerHour}</p>
                <p className="text-xs text-gray-400">/ hr</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50 p-6 text-center">
        <h2 className="text-base font-bold text-gray-900">
          Want to book a session with {tutor.name.split(" ")[0]}?
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Send a message and they&apos;ll get back to you to set up a time.
        </p>
        <a
          href={`mailto:tutor+${tutor.id}@coursemate.ca?subject=Tutoring inquiry`}
          className="inline-block text-white bg-brand-700 hover:bg-brand-800 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          Contact {tutor.name.split(" ")[0]}
        </a>
        <p className="text-xs text-gray-400 mt-3">
          Contact is currently handled by email. We&apos;ll forward your message.
        </p>
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
                    <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center">
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
