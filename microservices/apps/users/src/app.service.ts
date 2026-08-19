import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from './db/db.module';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE) private db
  ) {
  }
  async createUser(object) {
    const result = await this.db.insert(users).values(object);
    // result has insertId (for auto-increment PK)
    const inserted = await this.db
      .select({
        id: users.user_id,
        username: users.username,
        nickname: users.nickname,
        followers_count: users.followers_count,
      })
      .from(users)
      .where(eq(users.user_id, result[0].insertId));

    return inserted[0];
  }
}
