import { HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import * as admin from 'firebase-admin';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<Comment | undefined> {
    const { type, text, postId, parentCommentId, user } = createCommentDto;

    const { displayName, photoURL, uid } = user;

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
        userId: uid,
        userDisplayName: displayName!,
        ...(photoURL && { userPhotoUrl: photoURL }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const indexData =
        type === 'comment'
          ? { commentPath: targetRef.path, uid }
          : { replyPath: targetRef.path, uid };

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

  async findAll(
    postId: string,
    type: 'replies' | 'comments',
    parentCommentId?: string,
  ) {
    try {
      const firestore = admin.firestore();

      let collectionRef;

      if (type === 'comments') {
        collectionRef = firestore
          .collection('posts')
          .doc(postId)
          .collection('comments');
      } else if (type === 'replies') {
        if (!parentCommentId) {
          throw new HttpException(
            'parentCommentId is required for replies',
            400,
          );
        }
        collectionRef = firestore
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .doc(parentCommentId)
          .collection('replies');
      } else {
        throw new HttpException('Invalid type argument', 400);
      }

      const query = collectionRef.orderBy('createdAt', 'desc');
      const snapshot = await query.get();

      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();
        const updatedAt = data.updatedAt.toDate();

        return {
          ...data,
          id: doc.id,
          createdAt,
          updatedAt,
        };
      });

      return items;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }

  async update(
    postId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    try {
      const firestore = admin.firestore();

      const commentRef = firestore
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .doc(commentId);

      const commentSnap = await commentRef.get();

      if (!commentSnap.exists) {
        throw new HttpException('Comment not found', 404);
      }

      const updatedData: Comment = {
        ...(commentSnap.data() as Comment),
        ...updateCommentDto,
        updatedAt: new Date(),
      };

      await commentRef.update({ ...updatedData });

      const updatedAtToDate = updatedData.updatedAt.toString();

      return { ...updatedData, id: commentId, updatedAt: updatedAtToDate };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }

  async remove(postId: string, commentId: string): Promise<void> {
    try {
      const firestore = admin.firestore();

      const commentRef = firestore
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .doc(commentId);

      await commentRef.delete();
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }
}
