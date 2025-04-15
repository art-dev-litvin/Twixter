import React from "react";
import NewPost from "../../components/NewPost";
import Post from "../../components/Post";
import { PostType } from "../../types/post";

function Home() {
  const [posts, setPosts] = React.useState<PostType[]>([]);

  //React.useEffect(() => {

  //}, [])

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">Home page</h1>
      <div className="mb-8">
        <NewPost setPosts={setPosts} />
      </div>
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
