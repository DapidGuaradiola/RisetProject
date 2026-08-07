import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/db/db.module';
import type { DrizzleDB } from 'src/db/drizzle';
import { users } from 'src/db/schema';
import { createUserDTO } from './user.dto';
@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE)
        private db: DrizzleDB
    ) { }
    async findAll() {
        try {
            return await this.db.transaction(async (tx) => {
                return tx.query.users.findMany(
                );
            });
        } catch (e) {
            console.error(e);
        }
    }

    async findById(id: number) {
        try {
            return await this.db.transaction(async (tx) => {
                return tx.query.users.findFirst({
                    where: {
                        user_id: id
                    }
                });
            });
        } catch (e) {
            console.error(e);
        }
    }

    async create(dto: createUserDTO) {
        try {
            const inserted = await this.db.transaction(async (tx) => {
                tx.insert(users).values(dto);
            });
            console.log(inserted);
        } catch (e) {
            console.error(e);
        }
    }
}
