import React from "react";
import Button from "../Button";
import Popup from "../Popup";
import PostForm from "../PostForm";
import { createPost } from "../../services/api-requests/posts/createPost";
import { toast } from "react-toastify";
import { PostFormFields } from "../PostForm/schema";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";

function NewPost() {
  const [openPopup, setOpenPopup] = React.useState(false);
  const { setShouldUpdatePosts } = usePostsUpdates();

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const handleSubmit = async (values: PostFormFields) => {
    const res = await createPost(values);

    const newPost = handleResultWithToast(res);
    if (newPost) {
      toast.success("Post created!");
      setShouldUpdatePosts(true);
      setOpenPopup(false);
    }
  };

  return (
    <>
      <Button onClick={handlePopup(true)}>New post</Button>

      <Popup open={openPopup} onClose={handlePopup(false)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Create new post
        </h3>
        <PostForm operation="create" handleSubmit={handleSubmit} />
      </Popup>
    </>
  );
}

export default NewPost;
