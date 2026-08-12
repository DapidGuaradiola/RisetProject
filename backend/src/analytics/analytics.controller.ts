import { Controller,Sse, Inject } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {CLICKHOUSE} from './analytics.module';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @Inject(CLICKHOUSE)
    private readonly analyticsService: AnalyticsService) {   
  }
  @Sse('/comments')
    async streamComments(){
      return await this.analyticsService.streamComments();
    }
}
