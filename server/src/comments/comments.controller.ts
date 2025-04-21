import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('/new')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('/post/:id')
  findOne(@Param('id') postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Patch('/post/:postId/comment/:commentId')
  update(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(postId, commentId, updateCommentDto);
  }

  @Delete('/post/:postId/comment/:commentId')
  remove(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove(postId, commentId);
  }
}
