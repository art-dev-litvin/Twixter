import React from "react";
import Button from "../Button";
import Popup from "../Popup";
import PostForm from "../PostForm";
import { createPost } from "../../services/api-requests/createPost";
import { toast } from "react-toastify";
import { PostType } from "../../types/post";
import { PostFormFields } from "../PostForm/schema";

interface NewPostProps {
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

function NewPost({ setPosts }: NewPostProps) {
  const [openPopup, setOpenPopup] = React.useState(false);

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const handleSubmit = async (values: PostFormFields) => {
    const data = await createPost(values);

    if ("error" in data) {
      toast.error(data.error);
    } else {
      setPosts((prev) => [...prev, data]);
      toast.success("Post created!");

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
