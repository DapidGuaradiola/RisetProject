import { Controller, Get, Post, Inject, Sse, MessageEvent } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { interval, map, Observable, switchMap } from 'rxjs';

export interface AnalyticsMessage<T> {
  data: T[];
  duration: number | null;
}

@Controller('api')
export class AppController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersService: ClientProxy,
    @Inject('CONTENTS_SERVICE')
    private readonly contentsService: ClientProxy,
    @Inject('QUERIES_SERVICE')
    private readonly queriesService: ClientProxy,

  ) { }

  @Get('users')
  checkUser(){
    const res = this.usersService.send('cekidot',{});
    return res;
  }

  @Post('users')
  async createUsers(): Promise<Observable<string>> {
    return await this.usersService.send('createUser', { username: "david", nickname: "dvd123",password:"halodek", followers_count: 50, trust_score:6 });
  }

  //UserSignUpQuery
  // @Sse('/users/user-signed-up')
  // streamUserSignUp(): Observable<MessageEvent> {
  //   return interval(1000).pipe(
  //     switchMap(() =>
  //       this.queriesService.send('userSignUp', {}),
  //     ),
  //     map(({ result, duration }) => ({
  //       data: { data: result, duration } as AnalyticsMessage<any>,
  //     })),
  //   );
  // }
}
