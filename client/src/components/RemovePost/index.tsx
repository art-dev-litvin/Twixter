import React from "react";
import { removePost } from "../../services/api-requests/posts/removePost";
import { toast } from "react-toastify";
import { useState } from "react";
import Button from "../Button";
import Popup from "../Popup";
import Dropdown from "../Dropdown";
import { TPost } from "../../types/post";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

interface RemovePostProps {
  post: TPost;
  onRemovePost: () => void;
}

function RemovePost({ post, onRemovePost }: RemovePostProps) {
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePopup = (open: boolean) => () => {
    setOpenPopup(open);
  };

  const handleRemoveSubmit = async () => {
    setIsLoading(true);

    const res = await removePost(post.id);

    setIsLoading(false);

    if (handleResultWithToast(res)) {
      onRemovePost();
      toast.success("Post has been removed!");
    }
  };

  const slicedTitle =
    post.title.length > 30 ? post.title.slice(0, 30) + "..." : post.title;

  return (
    <>
      <Dropdown.Item onClick={handlePopup(true)}>Remove post</Dropdown.Item>

      <Popup open={openPopup} onClose={handlePopup(false)}>
        <div className="fixed z-50 top-1/2 left-1/2 -translate-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-4">Remove Account</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove post "{slicedTitle}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="destructive"
              onClick={handleRemoveSubmit}
              disabled={isLoading}>
              {isLoading ? "Removing..." : "Yes, Remove"}
            </Button>
            <Button
              variant="gray"
              onClick={handlePopup(false)}
              disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
}

export default RemovePost;
