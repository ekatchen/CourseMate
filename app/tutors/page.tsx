"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tutors, getAllCourses, getAverageRating } from "@/lib/data";
import TutorCard from "@/components/TutorCard";
import Link from "next/link";

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCourse = searchParams.get("course") ?? "";

  const [query, setQuery] = useState(initialCourse);
  const [input, setInput] = useState(initialCourse);
  const [sortBy, setSortBy] = useState<"rating" | "rate">("rating");

  const allCourses = getAllCourses();

  useEffect(() => {
    setQuery(initialCourse);
    setInput(initialCourse);
  }, [initialCourse]);

  const approved = tutors.filter((t) => t.status === "approved");

  const filtered = query
    ? approved.filter((t) =>
        t.courses.some((c) => c.code.toLowerCase().includes(query.toLowerCase()))
      )
    : approved;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return getAverageRating(b) - getAverageRating(a);
    return Math.min(...a.courses.map((c) => c.ratePerHour)) - Math.min(...b.courses.map((c) => c.ratePerHour));
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    setQuery(trimmed);
    router.push(trimmed ? `/tutors?course=${encodeURIComponent(trimmed)}` : "/tutors");
  }

  function clearSearch() {
    setInput("");
    setQuery("");
    router.push("/tutors");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Tutors</h1>
        <p className="text-sm text-gray-400 mt-1">
          Search by course code to find someone who already passed your class.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Course code — e.g. Calc 1000"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none"
          onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
          onBlur={e => e.currentTarget.style.boxShadow = "none"}
        />
        <button
          type="submit"
          className="text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: "#4F2683" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3D1A6E")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4F2683")}
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2.5 rounded-lg text-sm text-gray-400 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Course chips */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {allCourses.map((c) => {
          const active = query.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => {
                setInput(c);
                setQuery(c);
                router.push(`/tutors?course=${encodeURIComponent(c)}`);
              }}
              className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: "#4F2683", color: "#fff" }
                  : { backgroundColor: "#F4F0FA", color: "#5C2D91" }
              }
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          {sorted.length} tutor{sorted.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "rating" | "rate")}
          className="text-xs border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-600 focus:outline-none"
        >
          <option value="rating">Top rated</option>
          <option value="rate">Lowest rate</option>
        </select>
      </div>

      {/* Grid */}
      {sorted.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {sorted.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} highlightCourse={query || undefined} />
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-xl border border-gray-200 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-1">
            No tutors listed for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Leave your details and we&apos;ll notify you when one becomes available.
          </p>
          <Link
            href={`/request-a-tutor?course=${encodeURIComponent(query)}`}
            className="inline-block text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#4F2683" }}
          >
            Request a tutor for {query}
          </Link>
        </div>
      )}
    </div>
  );
}
