import FormComment from "./formReply";
import Replies from "./replies";
type CommentItem = {
  comment_id: number;
  video_id: number;
  user_id: number;
  comment: string;
  parent_comment_id: number;
  level: number;
  create_time: Timestamp;
  user: usersType;
};

type usersType = {
  user_id: number;
  username: string;
  nickname: string;
  followers_count: number;
};

type paramType = {
  data: CommentItem;
  dataReplies: CommentItem[];
  allReplies:  Record<number, CommentItem[]>
  videoId: number;
  userId: number;
};
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export default function Comment({
  data,
  dataReplies,
  videoId,
  userId,
  allReplies,
}: paramType) {
  return (
    <article
      key={data.comment_id}
      className="w-full min-h-25 flex items-start gap-5 bg-red mt-4"
    >
      <div className="shrink-0">
        <img
          src="https://picsum.photos/600/600"
          alt={data.user.username}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <div>
          <div className="flex-1 min-w-0 ">
            <span className="text-sm text-zinc-500">@{data.user.nickname}</span>
          </div>
          <p className="line-clamp-2 truncate">{data.comment}</p>
          {/* action button */}
          <div className="flex gap-5">
            <FormComment
              parent={data.comment_id}
              parentLevel={data.level}
              replyVideoId={videoId}
              replyUserId={userId}
            />
          </div>
        </div>
        {dataReplies?<Replies allReplies={allReplies}replies={dataReplies} userId={userId} videoId={videoId} />:''}
      </div>
    </article>
  );
}
