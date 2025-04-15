import { PostType } from "../../types/post";
import Post from "../Post";

interface PostsGridProps {
  posts: PostType[];
}

function PostsGrid({ posts }: PostsGridProps) {
  console.log(posts);

  return (
    <div className="grid grid-cols-2 gap-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} maxWidth={"100%"} />
      ))}
    </div>
  );
}

export default PostsGrid;
