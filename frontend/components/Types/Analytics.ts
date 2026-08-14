export interface TopVideo {
  video_id: string;
  comment_count: number;
}

export interface CommentsByMinute {
  minute: string;
  comment_count: number;
}

export interface TopReplier {
  top_comment_id: number;
  topic: string;
  reply_count: number;
}

export interface UserSignUp {
  user_count:number,
}

export interface AnalyticsState {
  topVideos: TopVideo[];
  commentsByMinute: CommentsByMinute[];
  topRepliers: TopReplier[];
  userSignUp: UserSignUp[];
  loading: {
    topVideos: boolean;
    commentsByMinute: boolean;
    topRepliers: boolean;
    userSignUp: boolean;
  };
  error: {
    topVideos: string | null;
    commentsByMinute: string | null;
    topRepliers: string | null;
    userSignUp: string | null;
  };
  durations: {
    topVideos: number | null;
    commentsByMinute: number | null;
    topRepliers: number | null;
    userSignUp: number | null;
  };
  filters: {
    days: number;
    hours: number;
    limit: number;
  };
}