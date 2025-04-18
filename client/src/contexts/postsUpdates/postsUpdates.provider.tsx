import React from "react";
import { PostsUpdatesContext } from "./postsUpdates.context";

export const PostsUpdatesProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [shouldUpdatePosts, setShouldUpdatePosts] =
    React.useState<boolean>(false);

  return (
    <PostsUpdatesContext.Provider
      value={{ shouldUpdatePosts, setShouldUpdatePosts }}>
      {children}
    </PostsUpdatesContext.Provider>
  );
};
