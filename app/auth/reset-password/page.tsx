import { Suspense } from "react";
import Link from "next/link";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">
            CourseMate
          </Link>
          <p className="text-sm text-gray-500 mt-1">Set a new password</p>
        </div>
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-sm text-gray-500 text-center">
              Loading…
            </div>
          }
        >
          <ResetPasswordClient />
        </Suspense>
      </div>
    </div>
  );
}
