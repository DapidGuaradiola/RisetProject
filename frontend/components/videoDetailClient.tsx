"use client";
import YouTubePlayer from "@/components/youtubePlayer";
import CommentSection from "@/components/commentSection";
import { Suspense, useState } from "react";
import UserGrid from "@/components/user";

type videoType = {
  video_id: number;
  title: string;
  yt_key: string;
  description: string;
  thumbnail: string;
  views_count: number;
};

type paramType = {
  data: videoType;
  id: number;
};

export default function VideoDetailClient({ data, id }: paramType) {
  const [state, setState] = useState<number>(-1);
  const Loading = () => <div>Loading ...</div>;
  return (
    <>
      <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-10 lg:px-16">
        <div className="mx-auto w-full flex gap-6">
          <div className="flex-1">
            <YouTubePlayer videoId={data.yt_key} />
            <div className="mt-6 space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                Video detail
              </p>
              <h1 className="text-4xl font-semibold tracking-tight">
                Video {data.title}
              </h1>
              <p className="max-w-2xl text-zinc-300">{data.description}</p>
            </div>
            <Suspense fallback={<Loading />}>
              <CommentSection videoId={id} userId={state} />
            </Suspense>
          </div>

          <UserGrid
            width={"w-[30%]"}
            sessionUser={state}
            setSessionUser={(id: number) => setState(id)}
          />
        </div>
      </main>
    </>
  );
}
