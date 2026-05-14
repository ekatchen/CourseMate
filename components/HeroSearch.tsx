"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const popularCourses = [
  "Calc 1000", "CS 1026", "Econ 1021", "Bio 1001",
  "Chem 1301", "Physics 1028", "Psych 1000", "Bus 1220",
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/tutors?course=${encodeURIComponent(trimmed)}` : "/tutors");
  }

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mt-8 max-w-lg mx-auto flex shadow-2xl rounded-xl overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Course code — e.g. Calc 1000, CS 1026"
          className="flex-1 px-5 py-4 text-sm bg-white focus:outline-none text-gray-900 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-white text-brand-700 hover:bg-brand-50 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-l border-gray-100 active:scale-[0.98]"
        >
          Find a Tutor
        </button>
      </form>

      {/* Course chips — horizontal scroll on mobile */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-1 justify-start sm:justify-center">
        {popularCourses.map((c) => (
          <button
            key={c}
            onClick={() => router.push(`/tutors?course=${encodeURIComponent(c)}`)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 active:scale-[0.97]"
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
