import { Injectable,Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import { CLICKHOUSE } from './analytics.module';
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
        const result = res.json();
        console.log(`[data from storage] ${result}`);
        return result;
    }
}
