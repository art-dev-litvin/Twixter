import React from "react";
import { TPost, PostsSortByType } from "../types/post";
import { getPosts } from "../services/api-requests/posts/getPosts";
import { postsLimitPerPage } from "../constants/postsLimitPerPage";
import { handleResultWithToast } from "../utils/handleResultWithToast";

export function useFetchPosts(
  pageCursorsHistoryRef: React.RefObject<(string | null)[]>,
  currentPageIndexRef: React.RefObject<number>
) {
  const [posts, setPosts] = React.useState<TPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEndReached, setIsEndReached] = React.useState(false);

  const fetchPosts = React.useCallback(
    async (sortBy: PostsSortByType, query: string) => {
      const cursor = pageCursorsHistoryRef.current[currentPageIndexRef.current];

      setIsLoading(true);

      const res = await getPosts({
        sortBy,
        limit: postsLimitPerPage,
        cursor,
        page: currentPageIndexRef.current,
        query,
      });

      const data = handleResultWithToast(res);

      if (data) {
        const { posts, totalPosts } = data;

        console.log(totalPosts);

        setPosts(posts);
        setIsEndReached(totalPosts <= postsLimitPerPage);

        const nextCursor = posts[posts.length - 1]?.id;

        if (nextCursor && !pageCursorsHistoryRef.current.includes(nextCursor)) {
          pageCursorsHistoryRef.current = [
            ...pageCursorsHistoryRef.current.slice(
              0,
              currentPageIndexRef.current + 1
            ),
            nextCursor,
          ];
        }
      }

      setIsLoading(false);
      window.scrollTo({ top: 0 });
    },
    [pageCursorsHistoryRef, currentPageIndexRef]
  );

  return {
    posts,
    isLoading,
    isEndReached,
    fetchPosts,
  };
}
