import { Pool } from "pg";
import { DrizzleDB } from "src/db/drizzle";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "../db/relations";
import { faker } from "@faker-js/faker";
import { videos, users, comments } from "../db/schema";
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    const pool = new Pool({
        connectionString: configService.get<string>('DATABASE_URL'),
    });
    const db: DrizzleDB = drizzle({ client: pool, relations });
    
    //videos
     const videosData = Array.from({ length: 10 }, () => ({
        title : faker.word.sample(),
    }));
    const insertedVideos = await db.insert(videos).values(videosData).returning({video_id: videos.video_id}); 
    const videoIds = insertedVideos.map(v => v.video_id);
    
    // users
    const usersData = Array.from({ length: 10 }, () => ({
        username: faker.person.fullName(),
        nickname: faker.person.firstName(),
    }));
    const insertedUser = await db.insert(users).values(usersData).returning({ user_id: users.user_id });
    const userIds = insertedUser.map(v => v.user_id);
    
    //comments
    const topLevelComments = Array.from({ length: 20 }, () => ({
        video_id: faker.helpers.arrayElement(videoIds),
        user_id: faker.helpers.arrayElement(userIds), 
        level: 0,
        comment: faker.word.words({ count:{min:8, max:15} }),
        create_time: faker.date.recent({ days: 30 }),
    }));
        
    const insertedComments = await db.insert(comments).values(topLevelComments).returning({ comment_id: comments.comment_id });

    const replies = Array.from({ length: 20 }, () => ({
        video_id: faker.helpers.arrayElement(videoIds),
        user_id: faker.helpers.arrayElement(userIds),
        parent_comment_id: faker.helpers.arrayElement(insertedComments).comment_id, // pick a real parent
        level: 1,
        comment: faker.word.words({ count:{min:8, max:15} }),
        create_time: faker.date.recent({ days: 30 }),
    }));
    await db.insert(comments).values(replies);
}
bootstrap();