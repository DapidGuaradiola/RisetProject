import { Controller, Sse, Inject } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Observable, switchMap, interval, map } from 'rxjs';
import type { CommentsMessage } from './types/comment ';
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService) {
  }
  @Sse('/comments')
  streamComments(): Observable<CommentsMessage> {
    console.log(process.env.CLICKHOUSE_URL);
    return interval(1000).pipe(
      switchMap(() => this.analyticsService.streamComments()),
      map(({ result, duration }) => ({ data: result, duration }) as CommentsMessage));
  }
}
