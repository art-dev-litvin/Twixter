import React from "react";
import NewPost from "../../components/NewPost";
import { PostType } from "../../types/post";
import { getPosts } from "../../services/api-requests/getPosts";
import { toast } from "react-toastify";
import PostsGrid from "../../components/PostsGrid";

function Home() {
  const [posts, setPosts] = React.useState<PostType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts();

      if ("error" in data) {
        toast.error(data.error);
      } else {
        setPosts(data);
      }

      setIsLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <div className="mt-12 pb-8">
      <h1 className="text-4xl text-center font-bold mb-8">Home page</h1>
      <div className="mb-8 pb-4 border-b border-slate-200">
        <NewPost setPosts={setPosts} />
      </div>
      {isLoading && <h2 className="text-xl">Fetching posts...</h2>}
      {!isLoading && posts.length === 0 && (
        <h2 className="text-xl">No posts yet :/</h2>
      )}
      <PostsGrid posts={posts} />
    </div>
  );
}

export default Home;
