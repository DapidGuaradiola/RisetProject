import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClickhouseService } from './clickhouse.service';
export interface Message<T> {
    result: T[];
    duration: number | null;
}

@Controller()
export class ClickhouseController {
    constructor(private chService: ClickhouseService) { }
    @MessagePattern('userSignUp')
    async userSignUp(): Promise<Message<any>> {
        const { result, duration } = await this.chService.getSignUpAnalytics();
        return { result, duration };
    }
    @MessagePattern('queries.clickhouse.getCommentTotal')
    async getCommentTotal() {
        console.log("hit controller")
        const res = await this.chService.getTotalComment();
        return res;
    }
    @MessagePattern('queries.clickhouse.getCommentsPerMinute')

    async getCommentsPerMinute() {
        const res = await this.chService.getCommentsPerMinutes();
        return res;
    }

    @MessagePattern('queries.clickhouse.getFilteredCommentsPerMinute')
    async getFilteredCommentsPerMinute() {
        const res = await this.chService.getFilteredCommentsPerMinutes();
        return res;
    }
}
