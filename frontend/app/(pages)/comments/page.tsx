import { revalidatePath } from "next/cache";

type CommentType = {
  video_id: number;
  user_id: number;
  comment_id: number;
  parent_comment_id: number;
  level: number;
  comment: string;
  create_time: string;
};

type CommentNode = CommentType & {
  children: CommentNode[];
};

const activeUserIds = [1, 2, 3, 4, 5, 7, 8];

async function createComment(formData: FormData) {
  "use server";

  const comment = String(formData.get("comment") ?? "").trim();
  if (!comment) {
    return;
  }

  const payload = {
    video_id: Number(formData.get("video_id") ?? 0),
    user_id: Number(formData.get("user_id") ?? 0),
    parent_comment_id: Number(formData.get("parent_comment_id") ?? 0),
    level: Number(formData.get("level") ?? 0),
    comment,
    create_time: new Date(),
  };

  await fetch("http://backend:3000/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  revalidatePath("/comments");
}

function buildCommentTree(comments: CommentType[]) {
  const nodes = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodes.set(comment.comment_id, {
      ...comment,
      children: [],
    });
  });

  nodes.forEach((node) => {
    const parent = node.parent_comment_id ? nodes.get(node.parent_comment_id) : undefined;

    if (parent && parent.comment_id !== node.comment_id) {
      parent.children.push(node);
      return;
    }

    roots.push(node);
  });

  const sortNodes = (items: CommentNode[]) => {
    items.sort((left, right) => {
      const leftTime = new Date(left.create_time).getTime();
      const rightTime = new Date(right.create_time).getTime();

      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return left.comment_id - right.comment_id;
    });

    items.forEach((item) => sortNodes(item.children));
  };

  sortNodes(roots);

  return roots;
}

function formatCommentTime(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Just now"
    : date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function CommentComposer({
  videoId,
  level,
  parentCommentId,
  userId,
  placeholder,
  compact = false,
}: {
  videoId: number;
  level: number;
  parentCommentId: number;
  userId: number;
  placeholder: string;
  compact?: boolean;
}) {
  return (
    <form action={createComment} className={compact ? "mt-3" : "mt-5"}>
      <input type="hidden" name="video_id" value={videoId} />
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="parent_comment_id" value={parentCommentId} />
      <input type="hidden" name="level" value={level} />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <textarea
          name="comment"
          rows={compact ? 2 : 4}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder={placeholder}
          required
        />

        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>Posting as user #{userId}</span>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
          >
            Send comment
          </button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  depth,
  videoId,
  activeUserId,
}: {
  comment: CommentNode;
  depth: number;
  videoId: number;
  activeUserId: number;
}) {
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${depth > 0 ? "ml-6 border-l-4 border-l-slate-300" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">User #{comment.user_id}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700">Level {comment.level}</span>
            <span>{formatCommentTime(comment.create_time)}</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">
            {comment.comment}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <CommentComposer
          videoId={videoId}
          level={comment.level + 1}
          parentCommentId={comment.comment_id}
          userId={activeUserId}
          placeholder={`Reply to comment #${comment.comment_id}`}
          compact
        />
      </div>

      {comment.children.length > 0 ? (
        <div className="mt-4 space-y-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.comment_id}
              comment={child}
              depth={depth + 1}
              videoId={videoId}
              activeUserId={activeUserId}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default async function Comments() {
  const data = await fetch("http://backend:3000/comments");
  const comments: CommentType[] = await data.json();
  const commentTree = buildCommentTree(comments);
  const activeUserId = activeUserIds[Math.floor(Math.random() * activeUserIds.length)];
  const activeVideoId = comments[0]?.video_id ?? 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto w-[60vw] min-w-[320px] max-w-5xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Comment section
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Join the discussion
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Top-level comments stay at level 0. Replies inherit the parent level plus one and keep the parent comment id as a reference.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right text-sm text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Active user</div>
            <div className="mt-1 font-semibold">#{activeUserId}</div>
          </div>
        </div>

        <CommentComposer
          videoId={activeVideoId}
          level={0}
          parentCommentId={0}
          userId={activeUserId}
          placeholder="Write a comment..."
        />

        <div className="mt-6 max-h-[65vh] overflow-y-auto pr-2">
          {commentTree.length > 0 ? (
            <div className="space-y-4">
              {commentTree.map((comment) => (
                <CommentItem
                  key={comment.comment_id}
                  comment={comment}
                  depth={0}
                  videoId={activeVideoId}
                  activeUserId={activeUserId}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No comments yet. Start the thread with the first message.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
