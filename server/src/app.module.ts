import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PostsModule,
    FirebaseModule,
    CommentsModule,
    RatingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
