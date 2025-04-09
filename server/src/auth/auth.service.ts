import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

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
}
