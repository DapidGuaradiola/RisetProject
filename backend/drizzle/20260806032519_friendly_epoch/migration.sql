CREATE TABLE "comments" (
	"video_id" integer,
	"user_id" integer,
	"comment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"parent_comment_id" integer,
	"level" integer,
	"create_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar UNIQUE,
	"nickname" varchar
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"video_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "videos_video_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1)
);
