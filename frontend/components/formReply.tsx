"use client";
import { useState } from "react";
export default function FormComment({
  isRoot = false,
  parent,
  parentLevel,
  replyUserId,
  replyVideoId,
}: {
  isRoot?: boolean;
  parent: number | undefined;
  parentLevel?: number;
  replyUserId: number;
  replyVideoId: number | undefined;
}) {
  const [reply, setReply] = useState(false);
  const [comment, setComment] = useState("");
  let handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://backend:3000/comments/", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        video_id: replyVideoId,
        parent_comment_id: parent,
        level: (isRoot? 0 : parentLevel! + 1),
        comment: comment,
        user_id: replyUserId,
      }),
    });
    if (res.ok) {
      setComment("");
    }
  };
  let handleButtonReply = () => {
    setReply(!reply);
  };
  return (
    <>
      <button
        onClick={handleButtonReply}
        className="cursor-pointer text-blue-400"
        hidden={isRoot}
      >
        reply
      </button>
      <form
        onSubmit={(e) => handleReply(e)}
        className="w-full flex"
        hidden={(!reply&&!isRoot)}
      >
        <input
          name="comment"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-10 text-xl pl-2 mr-2 border border-gray-800 rounded"
          placeholder="Write your reply"
        />
        <button type="submit" className="cursor-pointer">
          Reply
        </button>
      </form>
    </>
  );
}
