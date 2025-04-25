import React from "react";
import { usePostsUpdates } from "../contexts/postsUpdates/postsUpdates.hook";
import { PostsSortByType } from "../types/post";

export function usePostsUpdatesHandler(
  fetchPosts: (sortBy: PostsSortByType, query: string) => Promise<void>,
  sortBy: PostsSortByType,
  query: string
) {
  const { shouldUpdatePosts, setShouldUpdatePosts } = usePostsUpdates();
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (!isFirstRender.current && shouldUpdatePosts) {
      fetchPosts(sortBy, query);
      setShouldUpdatePosts(false);
    }
  }, [shouldUpdatePosts, fetchPosts, sortBy, query]);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);
}
