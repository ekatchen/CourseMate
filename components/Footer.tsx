import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-base font-bold text-brand-700">CourseMate</span>
          <p className="text-sm text-gray-400 mt-1">Find a tutor for your exact course.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 justify-center">
          <Link href="/tutors" className="hover:text-gray-700 transition-colors">Find a Tutor</Link>
          <Link href="/become-a-tutor" className="hover:text-gray-700 transition-colors">Become a Tutor</Link>
          <Link href="/request-a-tutor" className="hover:text-gray-700 transition-colors">Request a Tutor</Link>
          <Link href="/how-it-works" className="hover:text-gray-700 transition-colors">How it Works</Link>
          <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
        </nav>
        <p className="text-xs text-gray-300">&copy; {new Date().getFullYear()} CourseMate</p>
      </div>
    </footer>
  );
}
