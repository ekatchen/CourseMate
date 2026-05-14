import { Suspense } from "react";
import RequestTutorClient from "./RequestTutorClient";

export default function RequestTutorPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-10 text-sm text-gray-400">Loading…</div>}>
      <RequestTutorClient />
    </Suspense>
  );
}
