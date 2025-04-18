import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
//import { UpdateCommentDto } from './dto/update-comment.dto';
import * as admin from 'firebase-admin';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<Comment | undefined> {
    const {
      type,
      text,
      postId,
      userId,
      userDisplayName,
      userPhotoUrl,
      parentCommentId,
    } = createCommentDto;

    try {
      const firestore = admin.firestore();

      if (type === 'reply' && !parentCommentId) {
        throw new HttpException('parentCommentId is required for replies', 400);
      }

      const basePath = firestore.collection('posts').doc(postId);

      const targetRef =
        type === 'comment'
          ? basePath.collection('comments').doc()
          : basePath
              .collection('comments')
              .doc(parentCommentId!)
              .collection('replies')
              .doc();

      const indexRef = firestore
        .collection(type === 'comment' ? 'commentsIndex' : 'repliesIndex')
        .doc(targetRef.id);

      const messageData: Comment = {
        id: targetRef.id,
        text,
        userId: userId,
        userDisplayName: userDisplayName,
        ...(userPhotoUrl && { userPhotoUrl: userPhotoUrl }),
        createdAt: new Date(),
      };

      const indexData =
        type === 'comment'
          ? { commentPath: targetRef.path, userId }
          : { replyPath: targetRef.path, userId };

      // eslint-disable-next-line
      await firestore.runTransaction(async (t) => {
        t.set(targetRef, messageData);
        t.set(indexRef, indexData);
      });

      return messageData;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  //update(id: number, updateCommentDto: UpdateCommentDto) {
  //  return `This action updates a #${id} comment`;
  //}

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
