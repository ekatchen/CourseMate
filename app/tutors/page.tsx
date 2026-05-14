"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tutors, getAllCourses, Tutor, getAverageRating } from "@/lib/data";
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
    if (sortBy === "rating") {
      return getAverageRating(b) - getAverageRating(a);
    }
    return Math.min(...a.courses.map((c) => c.ratePerHour)) - Math.min(...b.courses.map((c) => c.ratePerHour));
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    setQuery(trimmed);
    const params = new URLSearchParams();
    if (trimmed) params.set("course", trimmed);
    router.push(`/tutors${trimmed ? `?course=${encodeURIComponent(trimmed)}` : ""}`);
  }

  function clearSearch() {
    setInput("");
    setQuery("");
    router.push("/tutors");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find a Tutor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search by exact course code to find someone who already aced your class.
        </p>
      </div>

      {/* Search + sort bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Course code, e.g. Calc 1000"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Course chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCourses.map((c) => (
          <button
            key={c}
            onClick={() => {
              setInput(c);
              setQuery(c);
              router.push(`/tutors?course=${encodeURIComponent(c)}`);
            }}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              query.toLowerCase() === c.toLowerCase()
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {sorted.length} tutor{sorted.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : ""}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "rating" | "rate")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="rating">Sort: Top rated</option>
          <option value="rate">Sort: Lowest rate</option>
        </select>
      </div>

      {/* Tutor grid */}
      {sorted.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} highlightCourse={query || undefined} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-lg font-semibold text-gray-800">No tutors found for &ldquo;{query}&rdquo;</h2>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            No one is tutoring this course yet — but you can request one.
          </p>
          <Link
            href={`/request-a-tutor?course=${encodeURIComponent(query)}`}
            className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Request a Tutor for {query}
          </Link>
        </div>
      )}
    </div>
  );
}
