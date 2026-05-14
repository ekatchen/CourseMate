"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

type Tab = "login" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage(
        "Account created! Check your email for a confirmation link, then log in."
      );
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    setError(null);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setForgotLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent — check your email.");
      setShowForgot(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
    setMessage(null);
    setShowForgot(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">
            CourseMate
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {tab === "login" ? "Welcome back" : "Join CourseMate today"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === "login"
                  ? "text-brand-700 border-b-2 border-brand-700 -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === "signup"
                  ? "text-brand-700 border-b-2 border-brand-700 -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-5 p-3.5 rounded-lg bg-green-50 border border-green-100 text-sm text-green-700">
                {message}
              </div>
            )}

            <form
              onSubmit={tab === "login" ? handleLogin : handleSignup}
              className="flex flex-col gap-4"
            >
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-colors"
                    style={{ "--tw-ring-color": "var(--color-brand-200)" } as React.CSSProperties}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@uwo.ca"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-colors"
                  style={{ "--tw-ring-color": "var(--color-brand-200)" } as React.CSSProperties}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">
                    Password
                  </label>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => { setShowForgot(!showForgot); setError(null); }}
                      className="text-xs text-brand-600 hover:text-brand-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-colors"
                  style={{ "--tw-ring-color": "var(--color-brand-200)" } as React.CSSProperties}
                />
              </div>

              {showForgot && tab === "login" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-3">
                    Enter your email and we&rsquo;ll send a reset link.
                  </p>
                  <form onSubmit={handleForgotPassword} className="flex gap-2">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="you@uwo.ca"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 whitespace-nowrap"
                    >
                      {forgotLoading ? "Sending…" : "Send link"}
                    </button>
                  </form>
                </div>
              )}

              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    I'm joining as a…
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`border rounded-xl px-4 py-3.5 text-left transition-all ${
                        role === "student"
                          ? "border-brand-700 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          role === "student" ? "text-brand-700" : "text-gray-700"
                        }`}
                      >
                        Student
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Find tutors</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("tutor")}
                      className={`border rounded-xl px-4 py-3.5 text-left transition-all ${
                        role === "tutor"
                          ? "border-brand-700 bg-brand-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          role === "tutor" ? "text-brand-700" : "text-gray-700"
                        }`}
                      >
                        Tutor
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Offer tutoring</p>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 mt-1"
              >
                {loading
                  ? "Please wait…"
                  : tab === "login"
                  ? "Log in"
                  : "Create account"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing up you agree to our{" "}
          <span className="underline cursor-pointer hover:text-gray-600">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-gray-600">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
