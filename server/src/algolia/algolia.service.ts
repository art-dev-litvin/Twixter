import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { algoliasearch, SearchClient } from 'algoliasearch';

@Injectable()
export class AlgoliaService {
  private client: SearchClient;
  private indexName: string;

  constructor(private configService: ConfigService) {
    const ALGOLIA_APP_ID = this.configService.get<string>('ALGOLIA_APP_ID');
    const ALGOLIA_API_KEY = this.configService.get<string>(
      'ALGOLIA_SEARCH_API_KEY',
    );
    const ALGOLIA_INDEX_NAME =
      this.configService.get<string>('ALGOLIA_INDEX_NAME');

    if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX_NAME) {
      throw new Error('Missing Algolia environment variables');
    }

    this.indexName = ALGOLIA_INDEX_NAME;
    this.client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  }

  searchPosts = async (query: string, page = 0, hitsPerPage = 10) => {
    const res = await this.client.searchSingleIndex({
      indexName: this.indexName,
      searchParams: { query, hitsPerPage, page },
    });

    console.log(res.nbHits);

    const ids = res.hits.map((hit) => hit.objectID);

    return { ids, totalItems: res.nbHits };
  };

  //savePosts = (posts: TPost[]) => {
  //  const objects = posts.map((post) => ({
  //    ...post,
  //    objectID: post.id,
  //  }));

  //  return this.client.saveObjects({
  //    objects,
  //    indexName: this.indexName,
  //  });
  //};

  //savePost = (post: TPost) => {
  //  const body = {
  //    ...post,
  //    objectID: post.id,
  //  };

  //  return this.client.saveObject({
  //    body,
  //    indexName: this.indexName,
  //  });
  //};

  //deletePost = (postId) => {
  //  return this.client.deleteObject({
  //    objectID: postId,
  //    indexName: this.indexName,
  //  });
  //};
}
