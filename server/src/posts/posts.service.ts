import * as admin from 'firebase-admin';
import { HttpException, Injectable } from '@nestjs/common';
import { TPost } from 'src/types/post';
import { UpdatePostDto } from './dtos/update-post.dto';
import { AlgoliaService } from 'src/algolia/algolia.service';
import { FieldPath } from 'firebase-admin/firestore';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private algoliaService: AlgoliaService) {}

  async createPost({
    title,
    content,
    imageUrl,
    imageId,
    userId,
    userDisplayName,
    userPhotoUrl,
  }: CreatePostDto) {
    try {
      const newPostRef = admin.firestore().collection('posts').doc();
      const postId = newPostRef.id;

      const newPost: TPost = {
        id: postId,
        title,
        content,
        createdAt: new Date(),
        ...(imageUrl && { imageUrl }),
        ...(userPhotoUrl && { userPhotoUrl }),
        userId,
        userDisplayName,
        commentsCount: 0,
        likesCount: 0,
      };

      await newPostRef.set(newPost);

      if (imageId) {
        const uploadedImageRef = admin
          .firestore()
          .collection('posts-images')
          .doc(imageId);

        await uploadedImageRef.update({
          temporary: false,
          usedInPostId: postId,
        });
      }

      return newPost;
    } catch (error) {
      throw new HttpException(`Failed to create post: ${error.message}`, 400);
    }
  }

  async getPosts({
    cursor,
    page,
    limit,
    searchQuery,
    sortBy = 'commentsCount',
  }: {
    cursor?: string;
    page?: number;
    limit: number;
    searchQuery: string;
    sortBy?: 'commentsCount' | 'likesCount';
  }): Promise<{ posts: TPost[]; totalPosts: number }> {
    const postsCollection = admin.firestore().collection('posts');

    let algoliaResult: { ids: string[]; totalPosts: number } = {
      ids: [],
      totalPosts: 0,
    };

    if (searchQuery) {
      const { ids, totalItems = 0 } = await this.algoliaService.searchPosts(
        searchQuery,
        page,
        limit,
      );

      algoliaResult = {
        ids,
        totalPosts: Number(page) === 0 ? totalItems : ids.length,
      };
    }

    const query: FirebaseFirestore.Query = postsCollection;

    if (algoliaResult.ids.length) {
      const batches: FirebaseFirestore.DocumentData[] = [];

      // Firebase allows max 10 element with "in"
      for (let i = 0; i < algoliaResult.ids.length; i += 10) {
        const chunk = algoliaResult.ids.slice(i, i + 10);
        const q = query.where(FieldPath.documentId(), 'in', chunk);
        const snapshot = await q.get();
        batches.push(...snapshot.docs);
      }

      const posts = batches.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();
        return { ...data, createdAt, id: doc.id };
      });

      const sortedPosts = algoliaResult.ids
        .map((id) => posts.find((p) => p.id === id))
        .filter(Boolean);

      sortedPosts.sort((a, b) => (b?.[sortBy] || 0) - (a?.[sortBy] || 0));

      console.log('last', algoliaResult.totalPosts);
      return { posts: sortedPosts, totalPosts: algoliaResult.totalPosts };
    }

    if (searchQuery && algoliaResult.ids.length === 0) {
      return { posts: [], totalPosts: 0 };
    }

    let firebaseQuery: FirebaseFirestore.Query = postsCollection.orderBy(
      sortBy,
      'desc',
    );

    if (cursor) {
      const lastDocSnapshot = await postsCollection.doc(cursor).get();
      if (lastDocSnapshot.exists) {
        firebaseQuery = firebaseQuery.startAfter(lastDocSnapshot);
      }
    }

    const totalPosts = (await firebaseQuery.count().get()).data().count;

    firebaseQuery = firebaseQuery.limit(limit);

    const snapshot = await firebaseQuery.get();

    const slicedPosts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt.toDate();
      return { ...data, createdAt, id: doc.id } as TPost;
    });

    return { posts: slicedPosts, totalPosts: totalPosts };
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

      return posts;
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

      return postData;
    } catch (error) {
      throw new HttpException(`Failed to get post: ${error.message}`, 400);
    }
  }

  async updatePost(postId: string, updateData: UpdatePostDto) {
    try {
      const { title, content, imageUrl, imageId } = updateData;
      const postRef = admin.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        throw new HttpException('Post not found', 404);
      }

      await postRef.update({
        title,
        content,
        updatedAt: new Date(),
        ...(imageUrl && {
          imageUrl: imageUrl,
        }),
      });

      if (imageId) {
        const uploadedImageRef = admin
          .firestore()
          .collection('posts-images')
          .doc(imageId);

        await uploadedImageRef.update({
          temporary: false,
          usedInPostId: postId,
        });
      }

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
