import VideoGrid from '../video';
import CommentSection from "../commentSection";
import ContentActionButton from "../Cards/ContentActionButton";

export default function ContentSection() {
  return (
    <div className={`relative flex flex-row gap-2 overflow-hidden w-full mx-auto`}>
      <VideoGrid />
      <ContentActionButton />
      <CommentSection userId={1} />
    </div>
  );
}