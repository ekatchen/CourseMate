"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none text-gray-900 placeholder-gray-300";

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
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#F4F0FA" }}
        >
          <svg className="w-5 h-5" style={{ color: "#4F2683" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Request received</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          We&apos;ve logged the demand for{" "}
          <span className="font-medium text-gray-800">{courseCode}</span>.
          We&apos;ll email you as soon as a tutor becomes available.
        </p>
        <a href="/tutors" className="inline-block mt-6 text-sm font-medium transition-colors" style={{ color: "#4F2683" }}>
          &larr; Browse available tutors
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Request a Tutor</h1>
        <p className="text-sm text-gray-400 mt-1">
          No tutor listed for your course yet? Submit a request and we&apos;ll reach out when one signs up.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name <span className="text-gray-300">*</span></label>
            <input required type="text" placeholder="e.g. Jamie Li" className={inputClass}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-300">*</span></label>
            <input required type="email" placeholder="you@uwo.ca" className={inputClass}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course code <span className="text-gray-300">*</span></label>
            <input
              required
              type="text"
              placeholder="e.g. Chem 1301"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className={inputClass}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anything else?{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. I have a midterm in two weeks and need help with a specific topic"
              className={inputClass}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"}
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 px-1">
          We&apos;ll email you when a tutor for this course becomes available.
        </p>

        <button
          type="submit"
          className="text-white py-3 px-6 rounded-lg font-semibold text-sm transition-colors"
          style={{ backgroundColor: "#4F2683" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3D1A6E")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4F2683")}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
