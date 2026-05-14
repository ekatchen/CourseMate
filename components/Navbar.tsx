"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/tutors", label: "Find a Tutor" },
    { href: "/become-a-tutor", label: "Become a Tutor" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        <Link href="/" className="flex items-center py-4">
          <span className="text-lg font-bold tracking-tight text-brand-700">CourseMate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-brand-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/request-a-tutor"
            className="text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 px-4 py-2 rounded-lg transition-colors"
          >
            Request a Tutor
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                pathname === l.href ? "text-brand-700" : "text-gray-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/request-a-tutor"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-white bg-brand-700 px-4 py-2 rounded-lg text-center"
          >
            Request a Tutor
          </Link>
        </div>
      )}
    </header>
  );
}
