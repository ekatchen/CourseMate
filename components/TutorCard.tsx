import Link from "next/link";
import Image from "next/image";
import { Tutor, getAverageRating, getLowestRate } from "@/lib/data";
import StarRating from "./StarRating";

type Props = {
  tutor: Tutor;
  highlightCourse?: string;
};

const sessionFormatLabel: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  both: "Online or in person",
};

export default function TutorCard({ tutor, highlightCourse }: Props) {
  const avg = getAverageRating(tutor);
  const lowestRate = getLowestRate(tutor);

  const displayCourses = highlightCourse
    ? tutor.courses.filter((c) =>
        c.code.toLowerCase().replace(/\s/g, "") ===
        highlightCourse.toLowerCase().replace(/\s/g, "")
      )
    : tutor.courses.slice(0, 2);

  return (
    <Link href={`/tutors/${tutor.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-700 hover:shadow-sm transition-all duration-150">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-50 flex-shrink-0">
            <Image src={tutor.photoUrl} alt={tutor.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate text-sm">
              {tutor.name}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {tutor.program} &middot; {tutor.year}
            </p>
            {tutor.reviews.length > 0 && (
              <div className="mt-1.5">
                <StarRating rating={avg} count={tutor.reviews.length} />
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-gray-900">
              From ${lowestRate}
              <span className="font-normal text-gray-400 text-xs">/hr</span>
            </p>
            {tutor.sessionFormat && (
              <p className="text-xs text-gray-400 mt-1">
                {sessionFormatLabel[tutor.sessionFormat] ?? tutor.sessionFormat}
              </p>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-500 line-clamp-2 leading-relaxed">{tutor.bio}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {displayCourses.map((course) => (
            <span
              key={course.code}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-brand-50 text-brand-700"
            >
              {course.code}
              {course.grade && <span className="text-brand-400">&middot; {course.grade}</span>}
              <span className="text-brand-400">&middot; ${course.ratePerHour}/hr</span>
            </span>
          ))}
          {!highlightCourse && tutor.courses.length > 2 && (
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-400">
              +{tutor.courses.length - 2} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
