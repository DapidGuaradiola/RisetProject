import Link from "next/link";

export default async function VideoGrid() {
  type videoType = {
    video_id: number,
    title: string,
    yt_key: string,
    description: string,
    thumbnail: string,
    views_count: number,
  };
  const res = await fetch("http://backend:3000/video");
  const videos: videoType[] = await res.json();
  return (
    <section className="w-full lg:w-full">
      <div className="grid gap-6 max-h-screen overflow-scroll scrollbar-none">
        {videos.map((v) => {
          return (
            <Link
              href={`/videos/${v.video_id}`}
              className="group overflow-hidden h-full rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl grid grid-cols-2 gap-3"
              key={v.video_id}
            >
              <div className="aspect-video w-[full] my-auto rounded-3xl overflow-hidden">
                <img src={v.thumbnail} alt={v.title} className="w-full"/>
                </div>
              <div className="space-y-3 p-5">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 group-hover:text-amber-700">
                  {v.title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                  {v.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
