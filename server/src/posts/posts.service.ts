import * as admin from 'firebase-admin';
import { HttpException, Injectable } from '@nestjs/common';
import { parseBase64Image } from 'src/utils/parseBase64Image';
import { uploadBase64ToFirebaseStorage } from 'src/utils/uploadBase64ToFirebaseStorage';
import { PostType } from 'src/types/post';
import { Timestamp } from 'firebase-admin/firestore';

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
    sortDirection = 'desc',
  }: {
    cursor?: string;
    limit: number;
    search?: string;
    sortBy?: 'commentsCount' | 'likesCount';
    sortDirection?: 'asc' | 'desc';
  }) {
    const postsCollection = admin.firestore().collection('posts');

    let query: FirebaseFirestore.Query = postsCollection;

    if (search) {
      query = query
        .where('content', '>=', search)
        .where('content', '<=', search + '\uf8ff');
    }

    query = query.orderBy(sortBy, sortDirection);

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
      const createdAt = data.createdAt.toDate(); // make date from timestamp instance

      return { ...data, createdAt };
    });

    return posts;
  }
}
