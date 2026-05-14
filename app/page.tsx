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
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
            Peer tutoring · Course-code search · Western University
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Find a tutor for{" "}
            <span className="text-indigo-600">your exact course.</span>
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
            Not just &ldquo;math help&rdquo; — find someone who already took{" "}
            <strong className="text-gray-700">Calc 1000</strong>, knows your professor,
            and aced the exact midterm you&apos;re studying for.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
            <div className="flex gap-2 shadow-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course code, e.g. Calc 1000"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Find Tutors
              </button>
            </div>
          </form>

          {/* Popular courses */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {popularCourses.map((c) => (
              <button
                key={c}
                onClick={() => router.push(`/tutors?course=${encodeURIComponent(c)}`)}
                className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-3">🎓</div>
          <h2 className="text-lg font-bold text-gray-900">For students</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Find someone who already took your course and understands the professor,
            assignments, midterms, final exam style, and what actually matters.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="text-2xl mb-3">💰</div>
          <h2 className="text-lg font-bold text-gray-900">For tutors</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Get paid to tutor courses you already did well in, without having to find
            clients yourself. Set your own rate and schedule.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Search your course",
                desc: "Type in your exact course code — like CS 1026 or Econ 1021 — and see tutors who already took it.",
              },
              {
                step: "2",
                title: "Compare tutors",
                desc: "See rates, reviews, grades earned, and teaching styles upfront. No surprises.",
              },
              {
                step: "3",
                title: "Get in touch",
                desc: "Contact your tutor directly to set up a session. Simple, fast, no middleman.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Know your course well?</h2>
          <p className="text-sm text-gray-500 mt-1">Earn money helping other students pass.</p>
        </div>
        <Link
          href="/become-a-tutor"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Become a Tutor →
        </Link>
      </section>
    </div>
  );
}
