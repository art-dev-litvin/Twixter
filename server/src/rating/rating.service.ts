import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  async ratePost(createRatingDto: CreateRatingDto) {
    const { postId, ratingType, userId } = createRatingDto;

    const firestore = admin.firestore();

    const postRef = firestore.collection('posts').doc(postId);
    const ratingRef = postRef.collection('ratings').doc(userId);

    const ratingSnap = await ratingRef.get();
    const batch = firestore.batch();

    if (!ratingSnap.exists) {
      // New rating
      batch.set(ratingRef, {
        type: ratingType,
        updatedAt: FieldValue.serverTimestamp(),
      });
      batch.update(postRef, {
        [`${ratingType}sCount`]: FieldValue.increment(1),
      });
    } else {
      const prev = ratingSnap.data()?.type;

      if (prev === ratingType) {
        // Toggle off (remove rating)
        batch.delete(ratingRef);
        batch.update(postRef, {
          [`${ratingType}sCount`]: FieldValue.increment(-1),
        });
      } else {
        // Switch from like <-> dislike
        batch.update(ratingRef, {
          type: ratingType,
          updatedAt: FieldValue.serverTimestamp(),
        });
        batch.update(postRef, {
          [`${ratingType}sCount`]: FieldValue.increment(1),
          [`${prev}sCount`]: FieldValue.increment(-1),
        });
      }
    }

    await batch.commit();
  }

  async getPostRatingCounts(postId: string) {
    const firestore = admin.firestore();

    const postSnap = await firestore.collection('posts').doc(postId).get();
    const data = postSnap.data();

    return {
      likes: data?.likesCount ?? 0,
      dislikes: data?.dislikesCount ?? 0,
    };
  }
}
