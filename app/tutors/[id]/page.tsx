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
      <Link href="/tutors" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
        ← Back to tutors
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-50 flex-shrink-0">
            <Image src={tutor.photoUrl} alt={tutor.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
            <p className="text-gray-500 mt-0.5">{tutor.program} · {tutor.year}</p>
            {tutor.reviews.length > 0 && (
              <div className="mt-2">
                <StarRating rating={avg} count={tutor.reviews.length} size="md" />
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-gray-700 leading-relaxed">{tutor.bio}</p>
      </div>

      {/* Courses */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Courses available</h2>
        <div className="flex flex-col gap-3">
          {tutor.courses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">{course.code}</p>
                <p className="text-sm text-gray-500">{course.name}</p>
                {course.grade && (
                  <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full">
                    Grade earned: {course.grade}
                  </span>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-indigo-600">${course.ratePerHour}</p>
                <p className="text-xs text-gray-400">per hour</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-6 bg-indigo-50 rounded-2xl border border-indigo-100 p-6 text-center">
        <h2 className="text-lg font-bold text-gray-900">Ready to book a session?</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Reach out to {tutor.name.split(" ")[0]} directly to set up a time.
        </p>
        <a
          href={`mailto:tutor+${tutor.id}@coursemate.ca?subject=Tutoring Inquiry`}
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Contact {tutor.name.split(" ")[0]}
        </a>
        <p className="text-xs text-gray-400 mt-3">
          Note: in the MVP, contact is handled manually. We&apos;ll forward your message.
        </p>
      </div>

      {/* Reviews */}
      {tutor.reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Reviews ({tutor.reviews.length})
          </h2>
          <div className="flex flex-col gap-4">
            {tutor.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{review.reviewerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
