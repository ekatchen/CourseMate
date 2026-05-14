"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { submitStudentRequest } from "@/lib/queries";

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 placeholder-gray-300";

export default function RequestTutorPage() {
  const searchParams = useSearchParams();
  const [courseCode, setCourseCode] = useState("");
  const [form, setForm] = useState({ name: "", email: "", courseName: "", helpNeeded: "" });
  const [integrityAgreed, setIntegrityAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const c = searchParams.get("course");
    if (c) setCourseCode(c);
  }, [searchParams]);

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!integrityAgreed) return;
    setSubmitting(true);
    setServerError(null);

    const { error } = await submitStudentRequest({
      student_name: form.name,
      student_email: form.email,
      manual_course_code: courseCode,
      manual_course_name: form.courseName,
      help_needed: form.helpNeeded,
      academic_integrity_agreed: true,
    });

    setSubmitting(false);
    if (error) {
      setServerError(error);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Your request has been submitted.</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          We&apos;ve logged the demand for{" "}
          <span className="font-medium text-gray-800">{courseCode}</span>.
          We&apos;ll email you when a tutor becomes available.
        </p>
        <a href="/tutors" className="inline-block mt-6 text-sm font-medium text-brand-700 hover:underline">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your name <span className="text-gray-300">*</span>
            </label>
            <input
              required type="text" placeholder="e.g. Jamie Li"
              value={form.name} onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-300">*</span>
            </label>
            <input
              required type="email" placeholder="you@uwo.ca"
              value={form.email} onChange={(e) => setField("email", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course code <span className="text-gray-300">*</span>
            </label>
            <input
              required type="text" placeholder="e.g. Chem 1301"
              value={courseCode} onChange={(e) => setCourseCode(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course name{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text" placeholder="e.g. Introductory Chemistry I"
              value={form.courseName} onChange={(e) => setField("courseName", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What do you need help with?{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. I have a midterm in two weeks and need help with a specific topic"
              value={form.helpNeeded} onChange={(e) => setField("helpNeeded", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Academic integrity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Academic integrity</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            CourseMate is for tutoring and academic support. Tutors may explain concepts, review practice problems,
            and help students prepare for assessments. Tutors may not complete assignments, quizzes, exams, labs,
            or take-home assessments for students.
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={integrityAgreed}
              onChange={(e) => setIntegrityAgreed(e.target.checked)}
              className="mt-0.5 accent-brand-700"
            />
            <span className="text-sm text-gray-700">
              I understand CourseMate is for tutoring and academic support, not completing graded work.
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-400 px-1">
          We&apos;ll email you when a tutor for this course becomes available.
        </p>

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="text-white bg-brand-700 hover:bg-brand-800 disabled:opacity-60 py-3 px-6 rounded-lg font-semibold text-sm transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
