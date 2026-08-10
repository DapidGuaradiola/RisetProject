"use client";

import { discoverValidationDepths } from "next/dist/server/app-render/instant-validation/instant-validation";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { FormEvent, useMemo, useState, useEffect } from "react";

type usersType = {
  user_id: number;
  username: string;
  nickname: string;
  followers_count: number;
};

type paramType = {
  userId: number;
  videoId: number;
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

function getInitial(author: string) {
  return author.trim().charAt(0).toUpperCase() || "?";
}

export default function CommentSection({ videoId, userId }: paramType) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:3000/comments/video/${videoId}`,
      );
      const data: CommentItem[] = await res.json();
      setComments(data);
      console.log(data);
      if (data) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const { topLevel, repliesByParent } = useMemo(() => {
    if (comments) {
      const validParentIds = new Set(
        comments.map((comment) => comment.comment_id),
      );
      const groupedReplies: Record<number, CommentItem[]> = {};
      const roots: CommentItem[] = [];

      for (const comment of comments) {
        const isReply =
          comment.level === 1 &&
          comment.parent_comment_id !== null &&
          validParentIds.has(comment.parent_comment_id);

        if (isReply) {
          const parentId = comment.parent_comment_id as number;
          if (!groupedReplies[parentId]) {
            groupedReplies[parentId] = [];
          }
          groupedReplies[parentId].push(comment);
        } else {
          roots.push(comment);
        }
      }
      return { topLevel: roots, repliesByParent: groupedReplies };
    } else {
      return { topLevel: [], repliesByParent: [] };
    }
  }, [comments]);

  function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault;
  }

  function FormReply({
    parent,
    parentLevel,
  }: {
    parent: number;
    parentLevel: number;
  }) {
    const [reply, setReply] = useState(false);
    const [comment, setComment] = useState(" ");
    let handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const res = await fetch("http://localhost:3000/comments/", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify({
          video_id: videoId,
          parent_comment_id: parent,
          level: parentLevel + 1,
          comment: comment,
          user_id: userId,
        }),
      });
      if(res.ok){
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
        >
          reply
        </button>
        <form
          onSubmit={(e) => handleReply(e)}
          className="w-full flex"
          hidden={!reply}
        >
          <input
            name="comment"
            type="text"
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
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

  return isLoading ? (
    <div className="animate-spin">
      <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24"></svg>
      Loading Comment Data...
    </div>
  ) : (
    <section>
      {/* Comment Header  */}
      <div className="w-full mt-2.5 border-b border-gray-500 rounded-t-xl">
        <h2 className="p-6 font-semibold text-2xl">
          {comments.length} Comments
        </h2>
      </div>
      <div className="py-6">
        {/* Add comment Handler */}
        <form onSubmit={handleAddComment} className="w-full flex">
          <input
            type="text"
            className="w-full h-10 text-xl mr-2 pl-2 border border-gray-800 rounded"
            placeholder="Write Your Comment"
          />
          <button type="submit" className="cursor-pointer">
            Comment
          </button>
        </form>

        {/*All Comments */}
        <div className="w-full">
          {comments.length === 0 ? (
            <p className="text-2xl font-bold">No Comment Here</p>
          ) : (
            topLevel.map((root) => (
              <article
                key={root.comment_id}
                className="w-full h-25 flex items-start gap-5 bg-red mt-4"
              >
                <div className="shrink-0">
                  <img
                    src="https://picsum.photos/600/600"
                    alt={root.user.username}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex-1 min-w-0 ">
                    <span className="text-sm text-zinc-500">
                      @{root.user.nickname}
                    </span>
                  </div>
                  <p className="line-clamp-2 truncate">{root.comment}</p>
                  <FormReply
                    parent={root.comment_id}
                    parentLevel={root.level}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

//   {/* Replies */}
//   {repliesByParent[root.comment_id] ? (
//     repliesByParent[root.comment_id].map((replies) => (
//       <article>
//         <div className="">
//           <img
//             src="https://picsum.photos/600/600"
//             alt={replies.user.username}
//             className="h-16 w-16 rounded-full object-cover"
//           />
//         </div>
//         <div>
//           <div className="flex-1 min-w-0 ">
//             <span className="text-sm text-zinc-500">
//               @{replies.user.nickname}
//             </span>
//           </div>
//           <p className="line-clamp-2 truncate">
//             {replies.comment}
//           </p>
//         </div>
//       </article>
//     ))
//   ) : (
//     <div>no replies</div>
//   )}
