import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">The basics</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          How CourseMate works
        </h1>
        <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-xl">
          CourseMate is a directory that connects Western University students with peer tutors
          who have already taken the same courses. There&apos;s no platform fee — students and tutors
          deal directly with each other.
        </p>
      </div>

      {/* For students */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">For students</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              step: "01",
              title: "Search by course code",
              body: "Type your course code — CS 1026, Calc 1000, Econ 1021 — and see every approved tutor who has listed that course. Results show their rate, grade earned, and a short bio.",
            },
            {
              step: "02",
              title: "Review profiles and pick a tutor",
              body: "Each profile shows the courses they tutor, the grade they received, their hourly rate, and reviews from past students. You can compare options before reaching out.",
            },
            {
              step: "03",
              title: "Contact them directly",
              body: "Click the contact button on their profile. Right now this opens an email. You and your tutor agree on a time, format, and rate — CourseMate isn't involved in the session.",
            },
            {
              step: "04",
              title: "No tutor listed yet?",
              body: "Submit a request for your course. We log the demand and email you when a tutor signs up. This also helps us know which courses to prioritize.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-5">
              <p className="text-2xl font-bold text-brand-700 opacity-20 flex-shrink-0 w-8">{item.step}</p>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For tutors */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">For tutors</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              step: "01",
              title: "Submit an application",
              body: "Fill out the tutor application with your name, program, year, a short bio, and the courses you want to tutor. For each course, you set your own hourly rate and optionally list the grade you earned.",
            },
            {
              step: "02",
              title: "We review your application",
              body: "Every application is reviewed manually before going live. We check that the information is complete and that the academic integrity agreement is accepted. We'll email you within 1–2 business days.",
            },
            {
              step: "03",
              title: "Your profile goes live",
              body: "Once approved, students can find you by course code. When a student reaches out, you decide whether to take them on, agree on a schedule, and set up sessions however works for you.",
            },
            {
              step: "04",
              title: "You keep everything you earn",
              body: "CourseMate doesn't take a cut of your sessions. You and the student agree on payment directly — cash, e-transfer, whatever you prefer. We don't process payments.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-5">
              <p className="text-2xl font-bold text-brand-700 opacity-20 flex-shrink-0 w-8">{item.step}</p>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business model */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">The business model</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 text-sm text-gray-500 leading-relaxed">
          <p>
            CourseMate is free right now — for both students and tutors. We don&apos;t charge listing fees,
            take a percentage of sessions, or require a subscription. Tutors keep 100% of what they earn.
          </p>
          <p>
            We&apos;re in early stages and focused on getting the product right before thinking about revenue.
            In the future, we may introduce optional paid features for tutors — things like profile boosts,
            verified grade badges, or priority placement. If that changes, we&apos;ll be upfront about it.
          </p>
          <p>
            We will not introduce hidden fees, take cuts from sessions without notice, or change the model
            in a way that disadvantages tutors who built their reputation on the platform.
          </p>
        </div>
      </section>

      {/* Academic integrity */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">Academic integrity</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 leading-relaxed">
          <p className="mb-3">
            CourseMate is for tutoring — not for completing graded work. Both tutors and students agree to
            this when they sign up. Tutors may explain concepts, work through practice problems, and help
            students prepare for exams. Tutors may not complete assignments, quizzes, labs, or take-home
            assessments on a student&apos;s behalf.
          </p>
          <p>
            If we receive a credible report that a tutor or student violated this policy, we will remove
            them from the platform.
          </p>
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/tutors"
          className="text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 px-5 py-3 rounded-lg transition-colors text-center"
        >
          Find a Tutor
        </Link>
        <Link
          href="/become-a-tutor"
          className="text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-5 py-3 rounded-lg transition-colors text-center"
        >
          Become a Tutor
        </Link>
      </div>
    </div>
  );
}
