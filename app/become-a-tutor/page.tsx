"use client";

import { useState } from "react";
import { submitTutorApplication } from "@/lib/queries";

type CourseEntry = { code: string; name: string; rate: string; grade: string };

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 placeholder-gray-300";

export default function BecomeTutorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [integrityAgreed, setIntegrityAgreed] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", program: "", year: "", bio: "",
  });

  const [courses, setCourses] = useState<CourseEntry[]>([
    { code: "", name: "", rate: "", grade: "" },
  ]);

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addCourse() {
    setCourses([...courses, { code: "", name: "", rate: "", grade: "" }]);
  }

  function removeCourse(i: number) {
    setCourses(courses.filter((_, idx) => idx !== i));
  }

  function updateCourse(i: number, field: keyof CourseEntry, value: string) {
    const updated = [...courses];
    updated[i][field] = value;
    setCourses(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!integrityAgreed) return;
    setSubmitting(true);
    setServerError(null);

    const { error } = await submitTutorApplication({
      display_name: form.name,
      email: form.email,
      program: form.program,
      year: form.year,
      bio: form.bio,
      university_name: "Western University",
      academic_integrity_agreed: true,
      courses,
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
        <h1 className="text-xl font-bold text-gray-900">Your tutor profile has been submitted for review.</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          We review all applications manually and will email you within 1&ndash;2 business days.
        </p>
        <a href="/" className="inline-block mt-6 text-sm font-medium text-brand-700 hover:underline">
          &larr; Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Become a Tutor</h1>
        <p className="text-sm text-gray-400 mt-1">
          List the courses you can tutor, set your rate, and let students find you.
          Every application is reviewed before your profile goes live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your info</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name <span className="text-gray-300">*</span>
              </label>
              <input
                required type="text" placeholder="e.g. Alex Chen"
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
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program <span className="text-gray-300">*</span>
              </label>
              <input
                required type="text" placeholder="e.g. Computer Science"
                value={form.program} onChange={(e) => setField("program", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-gray-300">*</span>
              </label>
              <select
                required value={form.year} onChange={(e) => setField("year", e.target.value)}
                className={inputCls}
              >
                <option value="" disabled>Select year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Graduate Student</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short bio <span className="text-gray-300">*</span>{" "}
              <span className="text-gray-400 font-normal text-xs">(shown on your profile)</span>
            </label>
            <textarea
              required rows={3}
              placeholder="Describe your experience with the courses you tutor. What do you focus on? How do you typically run a session?"
              value={form.bio} onChange={(e) => setField("bio", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Courses to tutor</h2>
            <p className="text-xs text-gray-400 mt-1">Add each course separately.</p>
          </div>

          {courses.map((course, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-3 items-start p-3 rounded-lg bg-brand-50">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Course code <span className="text-gray-300">*</span>
                </label>
                <input
                  required type="text" placeholder="e.g. Calc 1000"
                  value={course.code} onChange={(e) => updateCourse(i, "code", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Course name</label>
                <input
                  type="text" placeholder="e.g. Calculus I"
                  value={course.name} onChange={(e) => updateCourse(i, "name", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Rate/hr ($) <span className="text-gray-300">*</span>
                </label>
                <input
                  required type="number" placeholder="e.g. 25" min="10" max="100"
                  value={course.rate} onChange={(e) => updateCourse(i, "rate", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Grade earned</label>
                <div className="flex gap-1">
                  <input
                    type="text" placeholder="e.g. A+"
                    value={course.grade} onChange={(e) => updateCourse(i, "grade", e.target.value)}
                    className={inputCls}
                  />
                  {courses.length > 1 && (
                    <button
                      type="button" onClick={() => removeCourse(i)}
                      className="text-gray-300 hover:text-gray-500 px-1 text-lg leading-none transition-colors"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button" onClick={addCourse}
            className="text-sm font-medium text-brand-700 hover:underline self-start"
          >
            + Add another course
          </button>
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
              I agree not to complete graded work on behalf of students.
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-400 px-1">
          Applications are reviewed before going live. You&apos;ll receive an email once approved.
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
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
