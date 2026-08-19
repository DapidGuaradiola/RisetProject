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
}
