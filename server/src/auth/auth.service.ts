import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseAuthError, UserRecord } from 'firebase-admin/auth';
import { uploadBase64ToFirebaseStorage } from 'src/utils/uploadBase64ToFirebaseStorage';
import { parseBase64Image } from 'src/utils/parseBase64Image';
import * as admin from 'firebase-admin';

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
      const customToken = await auth.createCustomToken(userRecord.uid);

      return {
        customToken,
      };
    } catch (error) {
      console.log('this is error', error);
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

  async updateProfile(
    uid: string,
    username?: string,
    newPassword?: string,
    profileImageBase64?: string,
  ): Promise<{ result: string; updatedUser: UserRecord } | undefined> {
    const auth = this.firebaseService.getAuth();
    let photoURL: string | undefined = undefined;

    try {
      if (profileImageBase64) {
        const imagePath = `users/${uid}/profile-${Date.now()}`;

        const { mimeType, base64Data } = parseBase64Image(profileImageBase64);

        photoURL = await uploadBase64ToFirebaseStorage(
          base64Data,
          imagePath,
          mimeType,
        );
      }

      const userRecord = await auth.updateUser(uid, {
        displayName: username,
        password: newPassword,
        photoURL,
      });

      if (username || photoURL) {
        const firestore = admin.firestore();
        const postsRef = firestore.collection('posts');
        const userPostsQuery = postsRef.where('userId', '==', uid);

        const userPostsSnapshot = await userPostsQuery.get();
        const batch = firestore.batch();

        userPostsSnapshot.forEach((doc) => {
          batch.update(doc.ref, {
            userDisplayName: username || userRecord.displayName,
            userPhotoUrl: photoURL || userRecord.photoURL,
          });
        });

        await batch.commit();
      }

      return {
        result: 'Profile updated successfully',
        updatedUser: userRecord,
      };
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        throw new HttpException(error.message, 400);
      } else if (error instanceof Error) {
        throw new HttpException(error.message, 400);
      }
    }
  }
}
