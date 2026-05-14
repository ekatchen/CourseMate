import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <span className="text-base font-bold text-white tracking-tight">CourseMate</span>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-xs">
            Peer tutoring matched to your exact course. Built for Western University students.
          </p>
        </div>

        {/* For students */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            For Students
          </p>
          <nav className="flex flex-col gap-3">
            <Link href="/tutors" className="text-sm text-gray-400 hover:text-white transition-colors">
              Find a Tutor
            </Link>
            <Link href="/request-a-tutor" className="text-sm text-gray-400 hover:text-white transition-colors">
              Request a Tutor
            </Link>
            <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it Works
            </Link>
          </nav>
        </div>

        {/* For tutors */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            For Tutors
          </p>
          <nav className="flex flex-col gap-3">
            <Link href="/become-a-tutor" className="text-sm text-gray-400 hover:text-white transition-colors">
              Apply to Tutor
            </Link>
            <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it Works
            </Link>
            <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} CourseMate</p>
          <p className="text-xs text-gray-600">Western University</p>
        </div>
      </div>
    </footer>
  );
}
