import React from "react";
import { PostsUpdatesContext } from "./postsUpdates.context";

export const usePostsUpdates = () => {
  const context = React.useContext(PostsUpdatesContext);
  if (!context) {
    throw new Error(
      "usePostsUpdates must be used within a PostsUpdatesProvider"
    );
  }
  return context;
};
