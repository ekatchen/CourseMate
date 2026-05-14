"use client";

import { useState } from "react";
import { submitContactRequest } from "@/lib/queries";

type Props = {
  tutorId: string;
  tutorName: string;
  courseCodePrefill?: string;
};

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 placeholder-gray-300";

export default function ContactForm({ tutorId, tutorName, courseCodePrefill }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    courseCode: courseCodePrefill ?? "",
    preferredFormat: "" as "online" | "in_person" | "either" | "",
    preferredTimes: "",
    message: "",
  });

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.preferredFormat) return;
    setSubmitting(true);
    setServerError(null);

    const { error } = await submitContactRequest({
      tutor_id: tutorId,
      tutor_name: tutorName,
      student_name: form.name,
      student_email: form.email,
      manual_course_code: form.courseCode,
      preferred_format: form.preferredFormat as "online" | "in_person" | "either",
      preferred_times: form.preferredTimes,
      message: form.message,
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
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-6 text-center">
        <div className="w-9 h-9 rounded-full bg-white border border-brand-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-4 h-4 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-gray-900 text-sm">Request sent.</p>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll forward your message to {tutorName.split(" ")[0]}.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-6 text-center">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Want to book a session with {tutorName.split(" ")[0]}?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Fill out a short request and we&apos;ll forward it to them.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="inline-block text-white bg-brand-700 hover:bg-brand-800 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          Contact {tutorName.split(" ")[0]}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">Contact {tutorName.split(" ")[0]}</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-300 hover:text-gray-500 text-xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course <span className="text-gray-300">*</span>
            </label>
            <input
              required type="text" placeholder="e.g. CS 1026"
              value={form.courseCode} onChange={(e) => setField("courseCode", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred format <span className="text-gray-300">*</span>
            </label>
            <select
              required
              value={form.preferredFormat}
              onChange={(e) => setField("preferredFormat", e.target.value)}
              className={inputCls}
            >
              <option value="" disabled>Select format</option>
              <option value="online">Online</option>
              <option value="in_person">In person</option>
              <option value="either">Either works</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability{" "}
            <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <input
            type="text" placeholder="e.g. Weekday evenings, weekend afternoons"
            value={form.preferredTimes} onChange={(e) => setField("preferredTimes", e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message{" "}
            <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Anything specific you want to cover, or context about where you're at in the course."
            value={form.message} onChange={(e) => setField("message", e.target.value)}
            className={inputCls}
          />
        </div>

        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="text-white bg-brand-700 hover:bg-brand-800 disabled:opacity-60 py-2.5 px-6 rounded-lg font-semibold text-sm transition-colors"
        >
          {submitting ? "Sending..." : "Send Request"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          We&apos;ll forward your request to {tutorName.split(" ")[0]} by email.
        </p>
      </form>
    </div>
  );
}
