import { Injectable, Inject } from '@nestjs/common';
import { CLICKHOUSE } from './clickhouse.module';
import { ClickHouseClient } from '@clickhouse/client';

interface QueryResult<T> {
    result: T[];
    duration: number | null;
}

@Injectable()
export class ClickhouseService {
    constructor(@Inject(CLICKHOUSE) private ch: ClickHouseClient) { }

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
}
