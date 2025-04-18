import React from "react";

interface PostsUpdatesContextProps {
  shouldUpdatePosts: boolean;
  setShouldUpdatePosts: (value: boolean) => void;
}

export const PostsUpdatesContext = React.createContext<
  PostsUpdatesContextProps | undefined
>(undefined);
