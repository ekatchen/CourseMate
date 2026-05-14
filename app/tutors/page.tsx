import { Suspense } from "react";
import TutorsClient from "./TutorsClient";

export default function TutorsPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10 text-sm text-gray-400">Loading…</div>}>
      <TutorsClient />
    </Suspense>
  );
}
