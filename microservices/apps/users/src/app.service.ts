import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from './db/db.module';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE) private db
  ) { }

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

  async findAllId() {
    const rows = await this.db.select({ user_id: users.user_id }).from(users);
    return rows.map(row => row.user_id);
  }

  async findOne(user_id: number) {
    const res = await this.db
      .select()
      .from(users)
      .where(eq(users.user_id, user_id));
    return res[0];
  }

  async simulate(dto) {
    const convertedUsers = dto.map(u => ({
      ...u,
      create_time: new Date(u.create_time), // convert string ISO balik ke Date object
    }));
    return await this.db.transaction(async (tx) => {
      const result = await tx.insert(users).values(convertedUsers);
      const firstId = result.insertId;
      return dto.map((_, i) => firstId + i);
    });
  }
}
