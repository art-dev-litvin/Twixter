import { PostType } from "../../types/post";
import Post from "../Post";

interface PostsGridProps {
  posts: PostType[];
}

function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostsGrid;
