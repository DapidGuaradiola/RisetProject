import { Controller, Get, Post, Put, Delete, Param, Body} from '@nestjs/common';
import { CommentsService } from './comments.service';
import type { createCommentDTO } from './comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll(){
    return this.commentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id:number){
    return this.commentsService.findById(id);
  }
  @Post()
  async create(@Body() dto:createCommentDTO){
    return this.commentsService.create(dto);
  }
}
