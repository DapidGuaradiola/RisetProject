import VideoGrid from "@/components/video";
import UserGrid from "@/components/user";
import { Suspense } from "react";
export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fafafa_35%,#f4f4f5_100%)] px-6 py-10 text-zinc-900 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 text-sm text-zinc-500 shadow-sm backdrop-blur">
          Video and user examples for later recursive backend fetching
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={<div className="h-80 rounded-3xl bg-white" />}>
            <VideoGrid />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
