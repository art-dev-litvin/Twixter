import Post from "../../components/Post";

function Home() {
  const mockPost = {
    id: "1",
    title: "Sample Post Title",
    content: "This is a sample post content for demonstration purposes.",
    imageURL:
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    createdAt: new Date().toISOString(),
    rating: {
      likes: 10,
      dislikes: 2,
    },
    comments: [],
    userId: "123",
    userDisplayName: "John Doe",
    userPhotoURL:
      "https://images.unsplash.com/photo-1483470873734-93599652a354?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-6">Home page</h1>
      <div>
        <Post {...mockPost} />
      </div>
    </div>
  );
}

export default Home;
