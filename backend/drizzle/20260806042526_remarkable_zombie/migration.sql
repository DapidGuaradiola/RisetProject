ALTER TABLE "videos" ADD COLUMN "username" varchar;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_username_key" UNIQUE("username");