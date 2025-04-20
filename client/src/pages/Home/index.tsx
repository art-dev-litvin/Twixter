import React from "react";
import NewPost from "../../components/NewPost";
import { PostsSortByType, TPost } from "../../types/post";
import { getPosts } from "../../services/api-requests/posts/getPosts";
import PostsGrid from "../../components/PostsGrid";
import PostsSortBy from "../../components/PostsSortBySelect";
import Pagination from "../../components/Pagination";
import { postsLimitPerPage } from "../../constants/postsLimitPerPage";
import { useSearchParams } from "react-router-dom";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

function Home() {
  const [posts, setPosts] = React.useState<TPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchParams] = useSearchParams();
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [pageCursorsHistory, setPageCursorsHistory] = React.useState<
    (string | null)[]
  >([null]);
  const [isEndReached, setIsEndReached] = React.useState(false);
  const { shouldUpdatePosts, setShouldUpdatePosts } = usePostsUpdates();

  const fetchPosts = React.useCallback(
    async (sortBy: PostsSortByType | null) => {
      const cursor = pageCursorsHistory[currentPageIndex];

      const res = await getPosts({
        sortBy,
        limit: postsLimitPerPage,
        cursor: cursor,
      });

      const posts = handleResultWithToast(res);

      if (posts) {
        setPosts(posts);
        window.scrollTo({ top: 0 });
        setIsEndReached(posts.length < postsLimitPerPage);

        const nextCursor = posts[posts.length - 1]?.id;

        if (nextCursor && !pageCursorsHistory.includes(nextCursor)) {
          setPageCursorsHistory((prev) => {
            const updated = [...prev];
            updated[currentPageIndex + 1] = nextCursor;
            return updated;
          });
        }
      }

      setIsLoading(false);
    },
    [currentPageIndex, pageCursorsHistory]
  );

  React.useEffect(() => {
    setIsLoading(true);

    const sortBy = searchParams.get("sortBy") as PostsSortByType | null;

    fetchPosts(sortBy);
  }, [searchParams, fetchPosts]);

  React.useEffect(() => {
    if (shouldUpdatePosts) {
      fetchPosts(null);
      setShouldUpdatePosts(false);
    }
  }, [shouldUpdatePosts, fetchPosts, setShouldUpdatePosts]);

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (!isEndReached) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-8">Home page</h1>
      <div className="mb-8 pb-4 border-b border-slate-200 flex justify-between items-center">
        <NewPost />
        <div className="flex gap-4 items-center">
          <PostsSortBy />
          <span className="font-bold">Page {currentPageIndex + 1}</span>
        </div>
      </div>
      {isLoading && <h2 className="text-xl">Fetching posts...</h2>}
      {!isLoading && posts.length === 0 && (
        <h2 className="text-xl">No posts yet :/</h2>
      )}
      <PostsGrid posts={posts} />
      <Pagination
        currentPageIndex={currentPageIndex}
        onNext={goToNextPage}
        onPrev={goToPrevPage}
        isPrevDisabled={isLoading || currentPageIndex === 0}
        isNextDisabled={isLoading || isEndReached}
      />
    </div>
  );
}

export default Home;
