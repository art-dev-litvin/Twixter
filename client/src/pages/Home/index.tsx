import React from "react";
import NewPost from "../../components/NewPost";
import PostsGrid from "../../components/PostsGrid";
import PostsSortBy from "../../components/PostsSortBySelect";
import Pagination from "../../components/Pagination";
import SearchPosts from "../../components/SearchPosts";
import { useSearchParams } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import { useFetchPosts } from "../../hooks/useFetchPosts";
import { usePostsUpdatesHandler } from "../../hooks/usePostsUpdatesHandler";
import { PostsSortByType } from "../../types/post";

function Home() {
  const [searchParams] = useSearchParams();
  const sortBy = (searchParams.get("sortBy") ||
    "likesCount") as PostsSortByType;
  const query = searchParams.get("query") || "";

  const {
    currentPageIndex,
    pageCursorsHistoryRef,
    currentPageIndexRef,
    goToPrevPage,
    goToNextPage,
  } = usePagination();

  const { posts, isLoading, isEndReached, fetchPosts } = useFetchPosts(
    pageCursorsHistoryRef,
    currentPageIndexRef
  );

  usePostsUpdatesHandler(fetchPosts, sortBy, query);

  React.useEffect(() => {
    fetchPosts(sortBy, query);
  }, [sortBy, query, fetchPosts]);

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-8">Home page</h1>
      <div className="mb-8 pb-4 border-b border-slate-200 flex justify-between items-center">
        <NewPost />
        <div className="flex gap-4 items-center">
          <SearchPosts />
          <PostsSortBy />
          <span className="font-bold">Page {currentPageIndex + 1}</span>
        </div>
      </div>
      {isLoading && <h2 className="text-xl">Fetching posts...</h2>}
      {!isLoading && posts.length === 0 && !query && (
        <h2 className="text-xl">No posts yet ☁️</h2>
      )}
      {!isLoading && posts.length === 0 && query && (
        <h2 className="text-xl">No posts found, try to edit search ☁️</h2>
      )}
      <PostsGrid posts={posts} />
      <Pagination
        currentPageIndex={currentPageIndex}
        onNext={() =>
          goToNextPage(() => fetchPosts(sortBy, query), isEndReached)
        }
        onPrev={() => goToPrevPage(() => fetchPosts(sortBy, query))}
        isPrevDisabled={isLoading || currentPageIndex === 0}
        isNextDisabled={isLoading || isEndReached}
      />
    </div>
  );
}

export default Home;
