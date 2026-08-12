import { Injectable,Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import {CLICKHOUSE} from './clickhouse.constants';

@Injectable()
export class AnalyticsService {
    constructor(
        @Inject(CLICKHOUSE)
        private readonly ch: ClickHouseClient){}
    async streamComments() {
        const res = await this.ch.query({
            query : 'SELECT * FROM comments_storage',
            format: 'JSONEachRow'
        })
        const summary = res.response_headers?.['x-clickhouse-summary'];
        const parsedSummary = summary ? JSON.parse(summary as string) : null;
        const duration = parsedSummary ? Number(parsedSummary.elapsed_ns)/1e6 : null;
        const result = await res.json();
        console.log(`Each Queries Separator  ::::: [Duration] ${duration} ms`);
        return {result,duration};
    }
}
