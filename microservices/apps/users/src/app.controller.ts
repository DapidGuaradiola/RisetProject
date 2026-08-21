import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import type { createUserDTO } from './user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern('createUser')
  async getHello(@Payload() dto: createUserDTO): Promise<string> {
    return await this.appService.createUser(dto);
  }

  @MessagePattern('cekidot')
  async cekidot() {
    return 'halo ini udah connect';
  }

  @MessagePattern('users.findAllId')
  async findAllId() {
    return await this.appService.findAllId();
  }

  @MessagePattern('users.findOne')
  async findOne(
    @Payload() user_id: number
  ) {
    return await this.appService.findOne(user_id);
  }

  @MessagePattern('users.simulate')
  async simulate(@Payload() { newUsers }: { newUsers: createUserDTO[] }) {
    return await this.appService.simulate(newUsers);
  }
}

