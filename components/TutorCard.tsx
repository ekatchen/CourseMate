import Link from "next/link";
import Image from "next/image";
import { Tutor, getAverageRating, getLowestRate } from "@/lib/data";
import StarRating from "./StarRating";

type Props = {
  tutor: Tutor;
  highlightCourse?: string;
};

export default function TutorCard({ tutor, highlightCourse }: Props) {
  const avg = getAverageRating(tutor);
  const lowestRate = getLowestRate(tutor);

  const displayCourses = highlightCourse
    ? tutor.courses.filter((c) => c.code.toLowerCase() === highlightCourse.toLowerCase())
    : tutor.courses.slice(0, 2);

  return (
    <Link href={`/tutors/${tutor.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-indigo-50 flex-shrink-0">
            <Image
              src={tutor.photoUrl}
              alt={tutor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {tutor.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {tutor.program} · {tutor.year}
            </p>
            {tutor.reviews.length > 0 && (
              <div className="mt-1">
                <StarRating rating={avg} count={tutor.reviews.length} />
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-gray-900">
              From ${lowestRate}<span className="font-normal text-gray-400">/hr</span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{tutor.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {displayCourses.map((course) => (
            <span
              key={course.code}
              className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {course.code}
              {course.grade && (
                <span className="text-indigo-400">· {course.grade}</span>
              )}
              <span className="text-indigo-400">· ${course.ratePerHour}/hr</span>
            </span>
          ))}
          {!highlightCourse && tutor.courses.length > 2 && (
            <span className="inline-flex items-center bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
              +{tutor.courses.length - 2} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
