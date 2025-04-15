import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/new')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  async getPosts(
    @Query('cursor') cursor?: string,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('sortBy') sortBy: 'likesCount' | 'commentsCount' = 'likesCount',
    @Query('search') search?: string,
  ) {
    return this.postsService.getPosts({ cursor, limit, sortBy, search });
  }
}
