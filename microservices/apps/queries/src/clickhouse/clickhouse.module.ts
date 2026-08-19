import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService, } from '@nestjs/config';
import { ClickhouseService } from './clickhouse.service';
import { ClickHouseClient, createClient} from '@clickhouse/client';
import { ClickhouseController } from './clickhouse.controller';
export const CLICKHOUSE = Symbol('CLICKHOUSE_CONNECTION');
@Module({
    imports: [ConfigModule],
    providers: [ClickhouseService, {
        provide: CLICKHOUSE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService): ClickHouseClient => {
            return createClient({ url: configService.get("CLICKHOUSE_URL") });
        }
    },],
    exports: [CLICKHOUSE, ClickhouseService],
    controllers: [ClickhouseController],
})
export class ClickhouseModule { }
