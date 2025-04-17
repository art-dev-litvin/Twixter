import PostForm from "../../components/PostForm";
import { PostFormFields } from "../../components/PostForm/schema";
import { toast } from "react-toastify";
import { updatePost } from "../../services/api-requests/updatePost";
import { useParams } from "react-router-dom";
import React from "react";
import Card from "../../components/Card";
import { PostType } from "../../types/post";
import { getPost } from "../../services/api-requests/getPost";

function EditPost() {
  const params = useParams();
  const [post, setPost] = React.useState<PostType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      const postId = params.id;

      if (postId) {
        const data = await getPost(postId);

        if ("error" in data) {
          toast.error(data.error);
        } else {
          setPost(data.post);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [params]);
  const handleSubmit = async (values: PostFormFields) => {
    console.log("old image", post?.imageUrl);

    const data = await updatePost(post!.id, {
      ...values,
      oldImageUrl: post?.imageUrl,
    });

    if ("error" in data) {
      toast.error(data.error);
    } else {
      // success action
      toast.success("Post updated!");
    }
  };

  if (loading)
    return (
      <div>
        <h1 className="font-xl">Loading...</h1>
      </div>
    );

  if (!post)
    return (
      <div>
        <h1 className="font-xl">Post not found!</h1>
      </div>
    );

  return (
    <div>
      <Card>
        <PostForm
          operation="update"
          defaultFieldValues={{
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
          }}
          handleSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}

export default EditPost;
