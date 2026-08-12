import { Global, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ClickHouseClient, createClient } from '@clickhouse/client';
import { ConfigModule, ConfigService } from '@nestjs/config';
export const CLICKHOUSE = Symbol('CLICKHOUSE_CONNECTION');
@Global()
@Module({
  imports: [ConfigModule],
  providers: [AnalyticsService, {
    provide: CLICKHOUSE,
    inject: [ConfigService],
    useFactory: (configService:ConfigService):ClickHouseClient=>{
      return createClient({url: configService.get("CLICKHOUSE_URL")});
    }
  },],
  exports : [CLICKHOUSE,AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule { }
