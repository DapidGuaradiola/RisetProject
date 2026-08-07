'use client';

import { FormEvent, useMemo, useState } from 'react';

type CommentItem = {
	id: number;
	author: string;
	text: string;
	postedAt: string;
	level: number;
	parent: number | null;
};

const dummyComments: CommentItem[] = [
	{
		id: 1,
		author: 'Nadia',
		text: 'Great breakdown. The pacing is really easy to follow.',
		postedAt: '2 hours ago',
		level: 0,
		parent: null,
	},
	{
		id: 2,
		author: 'Rafi',
		text: 'Can you make a part 2 with deeper examples?',
		postedAt: '1 hour ago',
		level: 0,
		parent: null,
	},
	{
		id: 3,
		author: 'Sinta',
		text: 'Same here, I would watch that.',
		postedAt: '58 minutes ago',
		level: 1,
		parent: 2,
	},
	{
		id: 4,
		author: 'Bimo',
		text: 'Timestamp 03:24 was the key part for me.',
		postedAt: '36 minutes ago',
		level: 0,
		parent: null,
	},
	{
		id: 5,
		author: 'Alya',
		text: 'Nice summary, thank you.',
		postedAt: '25 minutes ago',
		level: 1,
		parent: 1,
	},
];

function getInitial(author: string) {
	return author.trim().charAt(0).toUpperCase() || '?';
}

export default function CommentSection() {
	const [comments, setComments] = useState<CommentItem[]>(dummyComments);
	const [draft, setDraft] = useState('');

	const { topLevel, repliesByParent } = useMemo(() => {
		const validParentIds = new Set(comments.map((comment) => comment.id));

		const groupedReplies: Record<number, CommentItem[]> = {};
		const roots: CommentItem[] = [];

		for (const comment of comments) {
			const isReply =
				comment.level === 1 &&
				comment.parent !== null &&
				validParentIds.has(comment.parent);

			if (isReply) {
				const parentId = comment.parent as number;
				if (!groupedReplies[parentId]) {
					groupedReplies[parentId] = [];
				}
				groupedReplies[parentId].push(comment);
			} else {
				roots.push(comment);
			}
		}

		return { topLevel: roots, repliesByParent: groupedReplies };
	}, [comments]);

	function handleAddComment(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const text = draft.trim();
		if (!text) {
			return;
		}

		const nextId = comments.length ? Math.max(...comments.map((item) => item.id)) + 1 : 1;
		const newComment: CommentItem = {
			id: nextId,
			author: 'You',
			text,
			postedAt: 'just now',
			level: 0,
			parent: null,
		};

		setComments((prev) => [newComment, ...prev]);
		setDraft('');
	}

	return (
		<section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
			<h2 className="text-xl font-semibold tracking-tight text-white">
				{topLevel.length} Comments
			</h2>

			<form onSubmit={handleAddComment} className="mt-4 flex items-start gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white">
					Y
				</div>
				<div className="w-full">
					<input
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						placeholder="Add a comment..."
						className="w-full border-0 border-b border-zinc-600 bg-transparent px-0 pb-2 pt-1 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-300"
					/>
					<div className="mt-3 flex justify-end">
						<button
							type="submit"
							className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
						>
							Comment
						</button>
					</div>
				</div>
			</form>

			<div className="mt-6 space-y-6">
				{topLevel.map((comment) => {
					const replies = repliesByParent[comment.id] ?? [];

					return (
						<article key={comment.id} className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-600/80 text-sm font-semibold text-white">
									{getInitial(comment.author)}
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium text-zinc-100">
										{comment.author}{' '}
										<span className="font-normal text-zinc-400">{comment.postedAt}</span>
									</p>
									<p className="mt-1 text-sm leading-6 text-zinc-200">{comment.text}</p>
								</div>
							</div>

							{replies.length > 0 && (
								<div className="ml-12 space-y-3 border-l border-zinc-700 pl-4">
									{replies.map((reply) => (
										<div key={reply.id} className="flex items-start gap-3">
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-100">
												{getInitial(reply.author)}
											</div>
											<div>
												<p className="text-sm font-medium text-zinc-100">
													{reply.author}{' '}
													<span className="font-normal text-zinc-400">{reply.postedAt}</span>
												</p>
												<p className="mt-1 text-sm leading-6 text-zinc-200">{reply.text}</p>
											</div>
										</div>
									))}
								</div>
							)}
						</article>
					);
				})}
			</div>
		</section>
	);
}