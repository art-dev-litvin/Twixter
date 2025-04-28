import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { HttpException } from '@nestjs/common';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    {
      logger: ['error', 'warn'],
    },
  );

  const allowedOrigins = [
    process.env.ORIGIN_DEV_CLIENT_URL,
    process.env.ORIGIN_PROD_CLIENT_URL,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new HttpException('Not allowed by CORS', 403));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  await app.init();
};
export const api = onRequest({ maxInstances: 1 }, async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});

export const deleteTemporaryImages = onSchedule('every 24 hours', async () => {
  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  const now = Date.now();
  //const cutoff = new Date(now - 24 * 60 * 60 * 1000);
  const cutoff = new Date(now - 2 * 60 * 1000);

  const snapshot = await db
    .collection('images')
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

  await Promise.all(deletions);
});
