import PostForm from "../../components/PostForm";
import { PostFormFields } from "../../components/PostForm/schema";
import { toast } from "react-toastify";
import { updatePost } from "../../services/api-requests/posts/updatePost";
import { useParams } from "react-router-dom";
import React from "react";
import Card from "../../components/Card";
import { TPost } from "../../types/post";
import { getPost } from "../../services/api-requests/posts/getPost";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

function EditPost() {
  const params = useParams();
  const [post, setPost] = React.useState<TPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchPost = async () => {
      const postId = params.id;

      if (postId) {
        const res = await getPost(postId);

        const post = handleResultWithToast(res);
        if (post) {
          setPost(post);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [params]);

  const handleSubmit = async (values: PostFormFields) => {
    const res = await updatePost(post!.id, values);

    if (handleResultWithToast(res)) {
      toast.success("Post updated!");
      navigate(routes.home);

      return {};
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
