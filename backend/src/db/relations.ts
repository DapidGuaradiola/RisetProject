import { defineRelations } from "drizzle-orm";
import { users, videos, comments } from "./schema";
export const relations = defineRelations(
    { users, videos, comments }, (r) => ({
        comments: {
            user: r.one.users({
                from: r.comments.user_id,
                to: r.users.user_id,
            }),
            video: r.one.videos({
                from: r.comments.video_id,
                to: r.videos.video_id,
            }),
            child: r.many.comments({
                from:r.comments.comment_id,
                to: r.comments.parent_comment_id,
            }),
            parent: r.one.comments({
                from:r.comments.parent_comment_id,
                to: r.comments.comment_id,
            })
        },
        users: {
            comments: r.many.comments()
        },
        videos: {
            comments: r.many.comments()
        },
    })
)