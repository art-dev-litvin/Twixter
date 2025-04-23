import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { onRequest } from 'firebase-functions/v2/https';
import { AppModule } from './app.module';
import * as express from 'express';
import { HttpException } from '@nestjs/common';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  const allowedOrigins = [
    process.env.ORIGIN_DEV_CLIENT_URL,
    process.env.ORIGIN_PROD_CLIENT_URL,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      console.log(allowedOrigins);
      console.warn(!origin || allowedOrigins.includes(origin));
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
