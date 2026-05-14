"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllCourses, Tutor } from "@/lib/data";
import { fetchApprovedTutors } from "@/lib/queries";
import { getAverageRating } from "@/lib/data";
import TutorCard from "@/components/TutorCard";
import Link from "next/link";

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCourse = searchParams.get("course") ?? "";

  const [query, setQuery] = useState(initialCourse);
  const [input, setInput] = useState(initialCourse);
  const [sortBy, setSortBy] = useState<"rating" | "rate">("rating");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  const allCourses = getAllCourses();

  // Fetch tutors whenever query changes
  useEffect(() => {
    setLoading(true);
    fetchApprovedTutors(query || undefined).then((data) => {
      setTutors(data);
      setLoading(false);
    });
  }, [query]);

  // Sync query from URL param
  useEffect(() => {
    setQuery(initialCourse);
    setInput(initialCourse);
  }, [initialCourse]);

  const sorted = [...tutors].sort((a, b) => {
    if (sortBy === "rating") return getAverageRating(b) - getAverageRating(a);
    return (
      Math.min(...a.courses.map((c) => c.ratePerHour)) -
      Math.min(...b.courses.map((c) => c.ratePerHour))
    );
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
          Search by course code to find someone who has already taken your class.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Course code — e.g. Calc 1000"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          className="text-white bg-brand-700 hover:bg-brand-800 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
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
          const active =
            query.toLowerCase().replace(/\s/g, "") === c.toLowerCase().replace(/\s/g, "");
          return (
            <button
              key={c}
              onClick={() => {
                setInput(c);
                setQuery(c);
                router.push(`/tutors?course=${encodeURIComponent(c)}`);
              }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                active
                  ? "bg-brand-700 text-white"
                  : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          {loading ? "Loading..." : `${sorted.length} tutor${sorted.length !== 1 ? "s" : ""}${query ? ` for "${query}"` : ""}`}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "rating" | "rate")}
          className="text-xs border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          <option value="rating">Top rated</option>
          <option value="rate">Lowest rate</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length > 0 ? (
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
            Leave your details and we&apos;ll reach out when one becomes available.
          </p>
          <Link
            href={`/request-a-tutor?course=${encodeURIComponent(query)}`}
            className="inline-block text-white bg-brand-700 hover:bg-brand-800 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Request a tutor for {query}
          </Link>
        </div>
      )}
    </div>
  );
}
