import * as admin from 'firebase-admin';
import { HttpException, Injectable } from '@nestjs/common';
import { parseBase64Image } from 'src/utils/parseBase64Image';
import { uploadBase64ToFirebaseStorage } from 'src/utils/uploadBase64ToFirebaseStorage';
import { PostType } from 'src/types/post';

@Injectable()
export class PostsService {
  async createPost({
    title,
    content,
    imageBase64,
    userId,
    userDisplayName,
    userPhotoURL,
  }: {
    title: string;
    content: string;
    imageBase64?: string;

    userId: string;
    userDisplayName: string;
    userPhotoURL?: string;
  }) {
    try {
      let imageURL: string | undefined;

      const newPostRef = admin.firestore().collection('posts').doc();
      const postId = newPostRef.id;

      if (imageBase64) {
        const imagePath = `posts/${postId}/image/${Date.now()}`;

        const { mimeType, base64Data } = parseBase64Image(imageBase64);

        imageURL = await uploadBase64ToFirebaseStorage(
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
        ...(imageURL && { imageURL }),
        ...(userPhotoURL && { userPhotoURL }),
        userId,
        userDisplayName,
        rating: { likes: 0, dislikes: 0 },
        comments: [],
      };

      await newPostRef.set(newPost);

      return newPost;
    } catch (error) {
      throw new HttpException(`Failed to create post: ${error.message}`, 400);
    }
  }

  async getPosts() {
    try {
      const snapshot = await admin.firestore().collection('posts').get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }
}
