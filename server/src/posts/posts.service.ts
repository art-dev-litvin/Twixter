import * as admin from 'firebase-admin';
import { HttpException, Injectable } from '@nestjs/common';
import { parseBase64Image } from 'src/utils/parseBase64Image';
import { uploadBase64ToFirebaseStorage } from 'src/utils/uploadBase64ToFirebaseStorage';
import { PostType } from 'src/types/post';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  async createPost({
    title,
    content,
    imageBase64,
    userId,
    userDisplayName,
    userPhotoUrl,
  }: {
    title: string;
    content: string;
    imageBase64?: string;

    userId: string;
    userDisplayName: string;
    userPhotoUrl?: string;
  }) {
    try {
      let imageUrl: string | undefined;

      const newPostRef = admin.firestore().collection('posts').doc();
      const postId = newPostRef.id;

      if (imageBase64) {
        const imagePath = `posts/${postId}/image/${Date.now()}`;

        const { mimeType, base64Data } = parseBase64Image(imageBase64);

        imageUrl = await uploadBase64ToFirebaseStorage(
          base64Data,
          imagePath,
          mimeType,
        );
      }

      const newPost: PostType = {
        id: postId,
        title,
        content,
        createdAt: new Date(),
        ...(imageUrl && { imageUrl }),
        ...(userPhotoUrl && { userPhotoUrl }),
        userId,
        userDisplayName,
        rating: { likes: 0, dislikes: 0 },
        comments: [],
        commentsCount: 0,
        likesCount: 0,
      };

      await newPostRef.set(newPost);

      return newPost;
    } catch (error) {
      throw new HttpException(`Failed to create post: ${error.message}`, 400);
    }
  }

  async getPosts({
    cursor,
    limit,
    search,
    sortBy = 'commentsCount',
  }: {
    cursor: string | null;
    limit: number;
    search?: string;
    sortBy?: 'commentsCount' | 'likesCount';
  }) {
    const postsCollection = admin.firestore().collection('posts');

    let query: FirebaseFirestore.Query = postsCollection;

    if (search) {
      query = query
        .where('content', '>=', search)
        .where('content', '<=', search + '\uf8ff');
    }

    query = query.orderBy(sortBy, 'desc');

    if (cursor) {
      const lastDocSnapshot = await postsCollection.doc(cursor).get();
      if (lastDocSnapshot.exists) {
        query = query.startAfter(lastDocSnapshot);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt.toDate();

      return { ...data, createdAt };
    });

    return { posts };
  }

  async getPostsByUser(userId: string) {
    try {
      const postsCollection = admin.firestore().collection('posts');
      const query = postsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
      const snapshot = await query.get();

      const posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();

        return { ...data, createdAt };
      });

      return { posts };
    } catch (error) {
      throw new HttpException(
        `Failed to get posts by user: ${error.message}`,
        400,
      );
    }
  }

  async getPost(postId: string) {
    try {
      const postDoc = await admin
        .firestore()
        .collection('posts')
        .doc(postId)
        .get();

      if (!postDoc.exists) {
        throw new HttpException('Post not found', 404);
      }

      const postData = postDoc.data();

      return { post: postData };
    } catch (error) {
      throw new HttpException(`Failed to get post: ${error.message}`, 400);
    }
  }

  async updatePost(postId: string, updateData: Partial<UpdatePostDto>) {
    try {
      const { title, content, imageBase64, oldImageUrl } = updateData;
      const postRef = admin.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();
      let imageUrl: string | undefined;
      if (!postDoc.exists) {
        throw new HttpException('Post not found', 404);
      }

      if (imageBase64) {
        const imagePath = oldImageUrl
          ? oldImageUrl
          : `posts/${postId}/image/${Date.now()}`;
        console.log('path', imagePath);
        console.log(oldImageUrl);
        const { mimeType, base64Data } = parseBase64Image(imageBase64);

        imageUrl = await uploadBase64ToFirebaseStorage(
          base64Data,
          imagePath,
          mimeType,
        );
      }

      const updatedAt = new Date();
      await postRef.update({
        title,
        content,
        ...((imageUrl || oldImageUrl) && { imageUrl: imageUrl || oldImageUrl }),
        updatedAt,
      });

      const updatedPost = await postRef.get();
      return { post: updatedPost.data() };
    } catch (error) {
      throw new HttpException(`Failed to update post: ${error.message}`, 400);
    }
  }

  async deletePost(postId: string) {
    try {
      const postRef = admin.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        throw new HttpException('Post not found', 404);
      }

      await postRef.delete();
    } catch (error) {
      throw new HttpException(`Failed to delete post: ${error.message}`, 400);
    }
  }
}
