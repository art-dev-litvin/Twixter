import React from "react";

export function usePagination() {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const pageCursorsHistoryRef = React.useRef<(string | null)[]>([null]);
  const currentPageIndexRef = React.useRef(0);

  const goToPrevPage = (fetchPosts: () => void) => {
    if (currentPageIndexRef.current > 0) {
      currentPageIndexRef.current -= 1;
      setCurrentPageIndex(currentPageIndexRef.current);
      fetchPosts();
    }
  };

  const goToNextPage = (fetchPosts: () => void, isEndReached: boolean) => {
    if (!isEndReached) {
      currentPageIndexRef.current += 1;
      setCurrentPageIndex(currentPageIndexRef.current);
      fetchPosts();
    }
  };

  return {
    currentPageIndex,
    pageCursorsHistoryRef,
    currentPageIndexRef,
    goToPrevPage,
    goToNextPage,
  };
}
