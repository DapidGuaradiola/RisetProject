import YouTubePlayer from '@/components/youtubePlayer';
import CommentSection from '@/components/commentSection';

type VideoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};
type CommentType = {
  video_id: number;
  user_id: number;
  comment_id: number;
  parent_comment_id: number;
  level: number;
  comment: string;
  create_time: string;
};
type videoType = {
    video_id: number,
    title: string,
    yt_key: string,
    description: string,
    thumbnail: string,
    views_count: number,
  };
export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = await params;
  const videoRes = await fetch(`http://localhost:3000/video/${id}`);
  const data: videoType= await videoRes.json();
  const commentRes = await fetch(`http://localhost:3000/video/${id}`);
  const commentData: CommentType[] = await commentRes.json();
  
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <YouTubePlayer videoId={data.yt_key} />
        <div className="mt-6 space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
            Video detail
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Video {data.title}</h1>
          <p className="max-w-2xl text-zinc-300">{data.description}
          </p>
        </div>
        <CommentSection commentData={comments}/>
      </div>
    </main>
  );
}