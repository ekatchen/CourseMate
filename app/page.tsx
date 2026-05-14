import Link from "next/link";
import { fetchApprovedTutors } from "@/lib/queries";
import TutorCard from "@/components/TutorCard";
import HeroSearch from "@/components/HeroSearch";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Matched to your course",
    desc: "Search by exact course code and find someone who already passed the same class with the same professor.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Real peer tutors",
    desc: "Every tutor is a fellow student who knows the assignments, exam style, and what actually matters in the course.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "No middleman",
    desc: "Contact tutors directly, agree on a time, and get started. No platform fees for students.",
  },
];

const steps = [
  {
    step: "01",
    title: "Search by course code",
    desc: "Type your exact course — CS 1026, Econ 1021, Calc 1000 — and see tutors who have already taken it.",
  },
  {
    step: "02",
    title: "Compare and choose",
    desc: "View rates, grades earned, session format, and student reviews before reaching out.",
  },
  {
    step: "03",
    title: "Contact directly",
    desc: "Send a request and your tutor will follow up to set a time. No fees, no friction.",
  },
];

export default async function HomePage() {
  const allTutors = await fetchApprovedTutors();
  const featured = allTutors.slice(0, 3);

  return (
    <div className="bg-[#FAFAFA]">

      {/* ── Hero ── */}
      <section style={{ background: "radial-gradient(ellipse at 65% 0%, #6B3FA0 0%, #4F2683 60%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-300 mb-6">
            <span className="w-5 h-px bg-brand-400 inline-block" />
            Western University · Peer Tutoring
            <span className="w-5 h-px bg-brand-400 inline-block" />
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight">
            Tutoring for your<br className="hidden sm:block" /> exact course.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-brand-200 max-w-xl mx-auto leading-relaxed">
            Find a student who already passed CS&nbsp;1026, Calc&nbsp;1000, or any other Western
            course — and book a session directly.
          </p>

          <HeroSearch />
        </div>

        {/* Social proof strip */}
        <div className="border-t border-white/10" style={{ background: "rgba(0,0,0,0.15)" }}>
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center gap-10 sm:gap-16">
            {[
              { value: "120+", label: "Tutors" },
              { value: "40+", label: "Courses covered" },
              { value: "Western", label: "University" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                <p className="text-brand-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-200 border-l-4 border-l-brand-700 p-7"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-5">
                <p className="text-3xl font-extrabold text-brand-700 leading-none mt-0.5 w-10 flex-shrink-0">
                  {item.step}
                </p>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet some tutors ── */}
      {featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Meet some tutors</h2>
              <p className="text-sm text-gray-500 mt-1">
                Real Western students available right now.
              </p>
            </div>
            <Link
              href="/tutors"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors whitespace-nowrap"
            >
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featured.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </section>
      )}

      {/* ── Tutor CTA band ── */}
      <section className="bg-brand-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Passed a tough course?
            </h2>
            <p className="text-brand-200 text-sm mt-2 max-w-sm leading-relaxed">
              Help someone else get through it. Set your own rate and start receiving student requests.
            </p>
          </div>
          <Link
            href="/become-a-tutor"
            className="bg-white text-brand-700 hover:bg-brand-50 px-7 py-3 rounded-full font-semibold text-sm transition-colors whitespace-nowrap active:scale-[0.98] shadow-lg"
          >
            Apply to Tutor
          </Link>
        </div>
      </section>

    </div>
  );
}
