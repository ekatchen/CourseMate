"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const popularCourses = [
  "Calc 1000", "CS 1026", "Econ 1021", "Bio 1001",
  "Chem 1301", "Physics 1028", "Psych 1000", "Bus 1220",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/tutors?course=${encodeURIComponent(trimmed)}` : "/tutors");
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300 mb-5">
            Course-specific peer tutoring
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Find a tutor for your exact course.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-brand-200 max-w-xl mx-auto leading-relaxed">
            Browse peer tutors by course code, compare rates, and request help when no tutor is listed yet.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Course code — e.g. Calc 1000, CS 1026"
              className="flex-1 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-400 border-0"
            />
            <button
              type="submit"
              className="bg-white text-brand-700 hover:bg-brand-50 px-5 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Find a Tutor
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {popularCourses.map((c) => (
              <button
                key={c}
                onClick={() => router.push(`/tutors?course=${encodeURIComponent(c)}`)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-md transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 border-t-[3px] border-t-brand-700">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-3">For students</p>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Find someone who already took your course.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Search by course code and find a tutor familiar with the structure, pace, and expectations of the class.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 border-t-[3px] border-t-brand-700">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-3">For tutors</p>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Tutor courses you already know well.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Create a profile, list the courses you can tutor, set your rate, and receive student requests.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search by course code",
                desc: "Type in your exact course — CS 1026, Econ 1021, Calc 1000 — and see tutors who have taken it.",
              },
              {
                step: "02",
                title: "Compare and choose",
                desc: "View rates, grades earned, and reviews before reaching out.",
              },
              {
                step: "03",
                title: "Contact directly",
                desc: "Send a request and your tutor will follow up to set up a session.",
              },
            ].map((item) => (
              <div key={item.step}>
                <p className="text-2xl font-bold text-brand-600 opacity-40 mb-3">{item.step}</p>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Did well in a course?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Apply to tutor it. Set your own rate and start receiving student requests.
          </p>
        </div>
        <Link
          href="/become-a-tutor"
          className="text-white bg-brand-700 hover:bg-brand-800 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
        >
          Become a Tutor
        </Link>
      </section>
    </div>
  );
}
