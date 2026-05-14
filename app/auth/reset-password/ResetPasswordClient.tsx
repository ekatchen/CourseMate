"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowser();
      const code = searchParams.get("code");

      if (code) {
        const { error: exchError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchError) {
          setError("This reset link has expired. Please request a new one.");
        } else {
          setReady(true);
        }
      } else {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setReady(true);
        } else {
          setError("Invalid or expired reset link. Please request a new one.");
        }
      }
    }
    init();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      {error && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
          {!ready && (
            <span>
              {" "}
              <Link href="/login" className="underline font-medium">
                Back to login
              </Link>
            </span>
          )}
        </div>
      )}

      {!ready && !error && (
        <p className="text-sm text-gray-500 text-center">
          Verifying your reset link…
        </p>
      )}

      {ready && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Updating…" : "Set new password"}
          </button>
        </form>
      )}
    </div>
  );
}
