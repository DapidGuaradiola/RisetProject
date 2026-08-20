import { Injectable, Inject } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { DrizzleDB } from 'src/db/drizzle';
import { DRIZZLE } from 'src/db/db.module';
import { comments } from 'src/db/schema';
import { eq } from 'drizzle-orm';
@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB) { }

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }
  async simulate(dto: CreateCommentDto[]) {
    const res = await this.db.insert(comments).values(dto).returning({ comment_id: comments.comment_id, level: comments.level });
    return res.map(v => { return { comment_id: v.comment_id, level: v.level } });
  }
  async findAllId() {
    const res = await this.db.select({ comments_id: comments.comment_id }).from(comments).where(eq(comments.level, 0));
    return res.map(v => v.comments_id);
  }
  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
