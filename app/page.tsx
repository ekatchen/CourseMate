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
    if (trimmed) router.push(`/tutors?course=${encodeURIComponent(trimmed)}`);
    else router.push("/tutors");
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Peer tutoring &middot; Western University
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Find a tutor for your exact course.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Browse peer tutors by course code, compare rates, and request help when no tutor is listed yet.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Course code — e.g. Calc 1000, CS 1026"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ focusRingColor: "#4F2683" } as React.CSSProperties}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"}
            />
            <button
              type="submit"
              className="text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              style={{ backgroundColor: "#4F2683" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3D1A6E")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4F2683")}
            >
              Find a Tutor
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {popularCourses.map((c) => (
              <button
                key={c}
                onClick={() => router.push(`/tutors?course=${encodeURIComponent(c)}`)}
                className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-md transition-colors hover:bg-gray-200"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">For students</p>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Find someone who already took your course.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Search by exact course code and find a tutor who knows your professor,
            the assignments, and what actually shows up on the exam.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">For tutors</p>
          <h2 className="text-base font-bold text-gray-900 mb-2">
            Get paid to tutor courses you already passed.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            List the courses you did well in, set your rate, and let students come to you.
            No marketing required.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 text-center mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search by course code",
                desc: "Type in your exact course — CS 1026, Econ 1021, Calc 1000 — and see tutors who already passed it.",
              },
              {
                step: "02",
                title: "Compare and choose",
                desc: "View rates, grades earned, reviews, and teaching styles before reaching out.",
              },
              {
                step: "03",
                title: "Contact directly",
                desc: "Message your tutor to set up a session. No platform fees, no scheduling system.",
              },
            ].map((item) => (
              <div key={item.step}>
                <p className="text-2xl font-bold mb-3" style={{ color: "#4F2683", opacity: 0.25 }}>
                  {item.step}
                </p>
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
            Apply to tutor it. Set your own rate and start getting students.
          </p>
        </div>
        <Link
          href="/become-a-tutor"
          className="text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          style={{ backgroundColor: "#4F2683" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#3D1A6E")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#4F2683")}
        >
          Become a Tutor
        </Link>
      </section>
    </div>
  );
}
