import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  async getBoats(): Promise<any[]> {
    const firestore = admin.firestore();
    const snapshot = await firestore.collection('boats').get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
