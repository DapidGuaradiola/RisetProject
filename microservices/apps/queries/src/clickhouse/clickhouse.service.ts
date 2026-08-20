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
        video_id,
        minute,
        countMerge(comments_this_minute) AS comments_this_minute
    FROM video_comment_minutes
    WHERE minute >= now() - INTERVAL {hours:UInt32} HOUR
    GROUP BY video_id, minute
    `;
        return this.run<{ minute: string; comment_count: number }>(query, { hours });
    }
}
