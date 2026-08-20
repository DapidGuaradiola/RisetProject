import { Injectable, Inject } from '@nestjs/common';
import { CLICKHOUSE } from './clickhouse.constants';
import { ClickHouseClient } from '@clickhouse/client';

export interface QueryResult<T> {
  result: T[];
  duration: number | null;
}

@Injectable()
export class ClickhouseService {
  constructor(
    @Inject(CLICKHOUSE)
    private ch: ClickHouseClient) { }

  private async run<T = any>(query: string, params?: Record<string, any>): Promise<QueryResult<T>> {
    const res = await this.ch.query({
      query,
      format: 'JSONEachRow',
      query_params: params,
    });
    const summary = res.response_headers?.['x-clickhouse-summary'];
    const parsedSummary = summary ? JSON.parse(summary as string) : null;
    const duration = parsedSummary ? Number(parsedSummary.elapsed_ns) / 1e6 : null;
    const result = await res.json<T>();
    console.log(`Each Queries Separator  ::::: [Duration] ${duration} ms`);
    return { result: result as unknown as T[], duration };
  }

  async getSignUpAnalytics() {
    const query = `
      SELECT
        count() AS user_count
      FROM users_storage
      WHERE create_time >= toStartOfHour(now())
      `;
    return this.run<{ user_count: number }>(query);
  }

  async getTotalComment() {
    console.log("hit service");
    const query = `
      SELECT * from video_comment_totals` ;
    return this.run<{ video_id: number, total_comments: number }>(query);
  }

  async getCommentsPerMinutes(hours = 24) {
    const query = `
      SELECT
        toStartOfMinute(create_time) AS minute,
        count() AS comment_count
      FROM comments_storage
      WHERE create_time >= now() - INTERVAL {hours:UInt32} HOUR
      GROUP BY minute
      ORDER BY minute ASC
    `;
    return this.run<{ minute: string; comment_count: number }>(query, { hours });
  }

  async getFilteredCommentsPerMinutes(hours = 24) {
    const query = `
      SELECT
        minute,
        countMerge(comments_this_minute) AS comment_count
    FROM video_comment_minutes
    WHERE minute >= now() - INTERVAL {hours:UInt32} HOUR
    GROUP BY minute
    `;
    return this.run<{ minute: string; comment_count: number }>(query, { hours });
  }

  async topVideosByComments(limit = 5, days = 1) {
    const query = `
      SELECT
        video_id,
        count() AS comment_count
      FROM comments_storage
      WHERE create_time >= now() - INTERVAL {days:UInt32} DAY
      GROUP BY video_id
      ORDER BY comment_count DESC
      LIMIT {limit:UInt32}
    `;
    return this.run<{ video_id: string; comment_count: number }>(query, { limit, days });
  }

  async topComments(limit = 5, days = 1) {
    const query = `
      SELECT
          parent_comment_id AS top_comment_id,
          any(p.comment) AS topic,
          count() AS reply_count
      FROM comments_storage AS c
      INNER JOIN comments_storage AS p
        ON c.parent_comment_id = p.comment_id
      WHERE p.level = 0 and  create_time >= now() - INTERVAL {days:UInt32} DAY
      GROUP BY parent_comment_id
      ORDER BY reply_count DESC
      LIMIT {limit:UInt32}
      `;
    return this.run<{ top_comment_id: number; topic: Text, reply_count: number }>(query, { limit, days });
  }

  async userSignedUp() {
    const query = `
      SELECT
        count() AS user_count
      FROM users_storage
      WHERE create_time >= toStartOfHour(now())
      `;
    return this.run<{ user_count: number }>(query);
  }
  async botCommentsCount() {
    const query = `
      SELECT sum(bot_comments_count) AS bot_comments_count  from bot_comments
      `;
    return this.run<{ bot_comments_count: number }>(query);
  }
}
