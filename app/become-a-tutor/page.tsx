"use client";

import { useState } from "react";

type CourseEntry = { code: string; name: string; rate: string; grade: string };

export default function BecomeTutorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState<CourseEntry[]>([
    { code: "", name: "", rate: "", grade: "" },
  ]);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">Application received!</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          Thanks for applying to be a tutor on CourseMate. We review all applications
          manually and will be in touch within 1–2 business days.
        </p>
        <a href="/" className="inline-block mt-6 text-indigo-600 text-sm font-medium hover:underline">
          ← Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Become a Tutor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Get paid to help other students in courses you already crushed.
          We review every application before your profile goes live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">Your info</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <input required type="text" placeholder="e.g. Alex Chen" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input required type="email" placeholder="you@uwo.ca" className={inputClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
              <input required type="text" placeholder="e.g. Computer Science" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <select required className={inputClass} defaultValue="">
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
              Short bio *{" "}
              <span className="text-gray-400 font-normal">(shown on your profile)</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell students why you'd be a great tutor. What courses did you do well in? What's your teaching style?"
              className={inputClass}
            />
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">Courses you want to tutor</h2>
          <p className="text-xs text-gray-400 -mt-2">Add each course separately.</p>

          {courses.map((course, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-3 items-start border border-gray-100 rounded-xl p-3 bg-gray-50">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Course code *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Calc 1000"
                  value={course.code}
                  onChange={(e) => updateCourse(i, "code", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Course name</label>
                <input
                  type="text"
                  placeholder="e.g. Calculus I"
                  value={course.name}
                  onChange={(e) => updateCourse(i, "name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rate/hr ($) *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 25"
                  min="10"
                  max="100"
                  value={course.rate}
                  onChange={(e) => updateCourse(i, "rate", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Grade earned</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="e.g. A+"
                    value={course.grade}
                    onChange={(e) => updateCourse(i, "grade", e.target.value)}
                    className={inputClass}
                  />
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(i)}
                      className="text-gray-400 hover:text-red-500 px-1 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            className="text-sm text-indigo-600 font-medium hover:underline self-start"
          >
            + Add another course
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Note:</strong> All applications are reviewed manually before your profile goes live.
          We&apos;ll email you when you&apos;re approved.
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white";
