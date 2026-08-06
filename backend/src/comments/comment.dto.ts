export type createCommentDTO = {
    video_id : number,
    user_id : number,
    parent_comment_id : number,
    level : number,
    comment: string,
    create_time : Date,
}