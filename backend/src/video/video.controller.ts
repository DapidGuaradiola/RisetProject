import { Controller,Get, Post, Put, Delete,Body,Param, ParseIntPipe } from '@nestjs/common';
import { VideoService } from './video.service';
import type { createVideoDTO } from './video.dto';
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {
    
  }
  @Get()
    async findAll(){
      return this.videoService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id:number){
      return this.videoService.findById(id);
    }
    @Post()
    async create(@Body() dto:createVideoDTO){
      return this.videoService.create(dto);
    }
  
}
