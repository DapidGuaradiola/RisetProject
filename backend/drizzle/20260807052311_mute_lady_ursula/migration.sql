ALTER TABLE "users" ADD COLUMN "followers_count" integer;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "yt_key" varchar;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "views_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "thumbnail" text;