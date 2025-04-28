import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Delete } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/new')
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  async getPosts(
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('sortBy') sortBy: 'likesCount' | 'commentsCount' = 'likesCount',
    @Query('query') searchQuery: string,
    @Query('cursor') cursor?: string,
    @Query('page') page?: number,
  ) {
    return this.postsService.getPosts({
      cursor,
      limit,
      sortBy,
      searchQuery,
      page,
    });
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() updateData: UpdatePostDto) {
    return this.postsService.updatePost(id, updateData);
  }

  @Get('/user/:id')
  async getPostsByUser(@Param('id') userId: string) {
    return this.postsService.getPostsByUser(userId);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
