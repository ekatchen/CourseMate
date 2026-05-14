import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">About</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          Built by Western students,<br />for Western students.
        </h1>
        <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-xl">
          CourseMate started because finding a tutor who actually knew your specific course — the professor,
          the exam format, the parts that trip people up — was harder than it should be.
        </p>
      </div>

      {/* The problem */}
      <section className="mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 leading-relaxed flex flex-col gap-3">
          <p>
            Generic tutoring platforms list tutors by subject area — math, chemistry, economics. That&apos;s not
            how university courses work. Two calculus courses at the same school can have completely different
            textbooks, grading schemes, and difficulty curves. A tutor who aced Calc 1301 at one university
            may not know the first thing about how Calc 1000 is taught at Western.
          </p>
          <p>
            CourseMate is course-specific. Every tutor lists the exact courses they can help with — not just
            the subject. Students search by course code and find someone who has already been through the same
            class, with the same professor, and the same assignments.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">What we care about</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              title: "Transparency",
              body: "We don't hide how CourseMate works or what tutors earn. There are no platform fees right now. If that changes, we'll say so clearly and in advance.",
            },
            {
              title: "Quality over quantity",
              body: "Every tutor application is reviewed manually. We'd rather have 20 vetted tutors than 200 unreviewed ones. A bad match wastes everyone's time.",
            },
            {
              title: "Academic integrity",
              body: "CourseMate is for tutoring. Tutors help students understand material — they don't complete graded work for them. Both sides agree to this before using the platform.",
            },
            {
              title: "Student economics",
              body: "Peer tutoring is more affordable than private tutoring agencies. Tutors set their own rates and keep everything they earn. We think that's how it should work.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Where we are */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">Where we are now</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500 leading-relaxed flex flex-col gap-3">
          <p>
            CourseMate is an early-stage product. We&apos;re currently focused on Western University and building
            out the tutor directory. Features like in-platform messaging, scheduling, and verified grade
            badges are on the roadmap but not live yet.
          </p>
          <p>
            If you have feedback — something that doesn&apos;t work, a course you can&apos;t find, or a feature that
            would genuinely help you — we want to hear it.
          </p>
          <a
            href="mailto:hello@coursemate.ca"
            className="font-medium text-brand-700 hover:underline"
          >
            hello@coursemate.ca
          </a>
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
          href="/how-it-works"
          className="text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 px-5 py-3 rounded-lg transition-colors text-center"
        >
          How it works
        </Link>
      </div>
    </div>
  );
}
