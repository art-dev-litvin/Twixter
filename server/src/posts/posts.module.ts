import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AlgoliaModule } from 'src/algolia/algolia.module';

@Module({
  imports: [FirebaseModule, AlgoliaModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
