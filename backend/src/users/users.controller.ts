import { Controller,Get,Post, Put, Delete, Body,Request,Response, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import type { createUserDTO } from './user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  async findAll(){
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id:number){
    return this.usersService.findById(id);
  }
  @Post()
  async create(@Body() dto:createUserDTO){
    return this.usersService.create(dto);
  }

}
