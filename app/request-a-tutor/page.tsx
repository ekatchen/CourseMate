"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RequestTutorPage() {
  const searchParams = useSearchParams();
  const [courseCode, setCourseCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const c = searchParams.get("course");
    if (c) setCourseCode(c);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-gray-900">Request received!</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          We&apos;ve noted the demand for a tutor in{" "}
          <strong className="text-gray-800">{courseCode}</strong>. We&apos;ll reach out when
          someone signs up to tutor that course.
        </p>
        <a href="/tutors" className="inline-block mt-6 text-indigo-600 text-sm font-medium hover:underline">
          ← Browse available tutors
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Request a Tutor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Can&apos;t find a tutor for your course? Let us know and we&apos;ll try to find one for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
            <input required type="text" placeholder="e.g. Jamie Li" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your email *</label>
            <input required type="email" placeholder="you@uwo.ca" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course code *</label>
            <input
              required
              type="text"
              placeholder="e.g. Chem 1301"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anything else?{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. I need help before my midterm next week, or I'm struggling with a specific topic"
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          We&apos;ll notify you by email as soon as a tutor for this course becomes available.
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white";
