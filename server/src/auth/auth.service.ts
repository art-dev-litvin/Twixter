import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as admin from 'firebase-admin';
import { FirebaseAuthError, UserRecord } from 'firebase-admin/auth';

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
        const matches = profileImageBase64.match(/^data:(.+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
          throw new Error('Invalid image data');
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = `users/${uid}/profile-${Date.now()}.jpg`;
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(filename);

        await fileUpload.save(buffer, {
          metadata: {
            contentType: mimeType,
          },
        });

        await fileUpload.makePublic();
        photoURL = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      }

      const userRecord = await auth.updateUser(uid, {
        displayName: username,
        password: newPassword,
        photoURL,
      });

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
