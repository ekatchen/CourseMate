"use client";

import { useState } from "react";

type CourseEntry = { code: string; name: string; rate: string; grade: string };

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none text-gray-900 placeholder-gray-300";

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
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "#F4F0FA" }}
        >
          <svg className="w-5 h-5" style={{ color: "#4F2683" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Application submitted</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
          We review all applications manually and will email you within 1&ndash;2 business days.
        </p>
        <a href="/" className="inline-block mt-6 text-sm font-medium transition-colors" style={{ color: "#4F2683" }}>
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
          List the courses you did well in, set your hourly rate, and let students find you.
          Every application is reviewed before your profile goes live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your info</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name <span className="text-gray-300">*</span></label>
              <input required type="text" placeholder="e.g. Alex Chen" className={inputClass}
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-300">*</span></label>
              <input required type="email" placeholder="you@uwo.ca" className={inputClass}
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program <span className="text-gray-300">*</span></label>
              <input required type="text" placeholder="e.g. Computer Science" className={inputClass}
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-gray-300">*</span></label>
              <select required className={inputClass} defaultValue=""
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"}>
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
              required
              rows={3}
              placeholder="Describe your experience with the courses you tutor. What do you focus on? How do you typically run a session?"
              className={inputClass}
              onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
              onBlur={e => e.currentTarget.style.boxShadow = "none"}
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
            <div key={i} className="grid sm:grid-cols-4 gap-3 items-start p-3 rounded-lg" style={{ backgroundColor: "#F7F5FA" }}>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Course code <span className="text-gray-300">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Calc 1000"
                  value={course.code}
                  onChange={(e) => updateCourse(i, "code", e.target.value)}
                  className={inputClass}
                  onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                  onBlur={e => e.currentTarget.style.boxShadow = "none"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Course name</label>
                <input
                  type="text"
                  placeholder="e.g. Calculus I"
                  value={course.name}
                  onChange={(e) => updateCourse(i, "name", e.target.value)}
                  className={inputClass}
                  onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                  onBlur={e => e.currentTarget.style.boxShadow = "none"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Rate/hr ($) <span className="text-gray-300">*</span></label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 25"
                  min="10"
                  max="100"
                  value={course.rate}
                  onChange={(e) => updateCourse(i, "rate", e.target.value)}
                  className={inputClass}
                  onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                  onBlur={e => e.currentTarget.style.boxShadow = "none"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Grade earned</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="e.g. A+"
                    value={course.grade}
                    onChange={(e) => updateCourse(i, "grade", e.target.value)}
                    className={inputClass}
                    onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px #4F268340"}
                    onBlur={e => e.currentTarget.style.boxShadow = "none"}
                  />
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(i)}
                      className="text-gray-300 hover:text-gray-500 px-1 transition-colors text-lg leading-none"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCourse}
            className="text-sm font-medium self-start transition-colors"
            style={{ color: "#4F2683" }}
          >
            + Add another course
          </button>
        </div>

        <p className="text-xs text-gray-400 border border-gray-200 rounded-lg px-4 py-3 bg-white">
          Applications are reviewed before going live. You&apos;ll receive an email once approved.
        </p>

        <button
          type="submit"
          className="text-white py-3 px-6 rounded-lg font-semibold text-sm transition-colors"
          style={{ backgroundColor: "#4F2683" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3D1A6E")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4F2683")}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
