import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseAuthError, UserRecord } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import { UpdateProfileDto } from './dtos/updateProfile.dto';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createUser(email: string, password: string, username: string) {
    try {
      const auth = this.firebaseService.getAuth();

      const userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      });
      const authToken = await auth.createCustomToken(userRecord.uid);

      return authToken;
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      } else if (error.code === 'auth/invalid-email') {
        throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
      } else if (error.code === 'auth/weak-password') {
        throw new HttpException('Password is too weak', HttpStatus.BAD_REQUEST);
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new HttpException('Operation not allowed', HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'Unexpected error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProfile({
    newPassword,
    userId,
    updatedImageUrl,
    username,
  }: UpdateProfileDto): Promise<UserRecord | undefined> {
    const auth = this.firebaseService.getAuth();

    try {
      const userRecord = await auth.updateUser(userId, {
        displayName: username,
        password: newPassword,
        photoURL: updatedImageUrl,
      });

      if (username || updatedImageUrl) {
        const firestore = admin.firestore();

        // update posts
        const postsRef = firestore.collection('posts');
        const userPostsQuery = postsRef.where('userId', '==', userId);

        const userPostsSnapshot = await userPostsQuery.get();
        const batch = firestore.batch();

        userPostsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            userDisplayName: username || userRecord.displayName,
            userPhotoUrl: updatedImageUrl || userRecord.photoURL,
          });
        });

        // update comments and replies
        const collectionsToUpdate = [
          {
            ref: firestore.collection('commentsIndex'),
            pathField: 'commentPath',
          },
          { ref: firestore.collection('repliesIndex'), pathField: 'replyPath' },
        ];

        for (const { ref, pathField } of collectionsToUpdate) {
          const userQuery = ref.where('userId', '==', userId);
          const userSnapshot = await userQuery.get();

          userSnapshot.forEach((doc) => {
            const path = doc.data()[pathField];
            const docRef = firestore.doc(path);

            batch.update(docRef, {
              userDisplayName: username || userRecord.displayName,
              userPhotoUrl: updatedImageUrl || userRecord.photoURL,
            });
          });
        }

        await batch.commit();
      }

      return userRecord;
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        throw new HttpException(error.message, 400);
      } else if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }

  async getUserById(uid: string): Promise<UserRecord> {
    const auth = this.firebaseService.getAuth();

    try {
      const userRecord = await auth.getUser(uid);
      return userRecord;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Unexpected error occurred while fetching user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
