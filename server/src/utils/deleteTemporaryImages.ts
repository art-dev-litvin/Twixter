import { FirebaseService } from 'src/firebase/firebase.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

export const deleteTemporaryImages = async () => {
  console.log('start deleting images');

  const app = await NestFactory.createApplicationContext(AppModule);
  const firebaseService = app.get(FirebaseService);

  const db = firebaseService.getFirestore();
  const bucket = firebaseService.getStorage().bucket();

  const now = Date.now();
  const cutoff = new Date(now - 2 * 60 * 1000);

  const snapshot = await db
    .collection('posts-images')
    .where('temporary', '==', true)
    .where('createdAt', '<', cutoff)
    .get();

  const deletions = snapshot.docs.map(async (doc) => {
    const data = doc.data();
    try {
      if (data.storagePath) {
        await bucket.file(data.storagePath).delete();
      }
      await doc.ref.delete();
      console.log(`🗑️ Deleted image: ${data.url}`);
    } catch (err) {
      console.error(`❌ Failed to delete image: ${data.url}`, err);
    }
  });

  if (!snapshot.docs.length) {
    console.log('No images to delete!');
  }

  await Promise.all(deletions);
};
