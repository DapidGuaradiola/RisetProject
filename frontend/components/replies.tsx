"use client";
import { useMemo, useState } from "react";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import Comment from "./comment";
type usersType = {
  user_id: number;
  username: string;
  nickname: string;
  followers_count: number;
};

type paramType = {
  userId: number;
  videoId: number;
  replies: CommentItem[];
  allReplies: Record<number,CommentItem[]>;
};

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

export default function Replies({ userId, videoId, replies, allReplies }: paramType) {
  const [showReplies, setShowReplies] = useState(false);

  return replies ? (
    <>
      <button onClick={()=>setShowReplies(!showReplies)}>show replies</button>
      <div hidden={!showReplies} className="max-h-100 overflow-scroll scrollbar-none">
        {replies.map((data) => (
          <Comment
            key={data.comment_id}
            data={data}
            dataReplies={allReplies[data.comment_id]}
            allReplies={allReplies}
            videoId={videoId}
            userId={userId}
          />
        ))}
      </div>
    </>
  ) : (
    <div>no replies</div>
  );
}
