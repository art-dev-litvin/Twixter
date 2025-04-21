import { EllipsisVerticalIcon } from "lucide-react";
import { TComment } from "../../types/comment";
import Avatar from "../Avatar";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { deleteComment } from "../../services/api-requests/comments/deleteComment";
import { handleResultWithToast } from "../../utils/handleResultWithToast";

interface CommentProps {
  comment: TComment;
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<TComment[]>>;
  setActiveComment: React.Dispatch<
    React.SetStateAction<{
      comment: TComment | null;
      type: "reply" | "edit" | null;
    }>
  >;
}

function Comment({
  comment,
  postId,
  setComments,
  setActiveComment,
}: CommentProps) {
  const { id, text, createdAt, updatedAt, userDisplayName, userPhotoUrl } =
    comment;

  const onDeleteComment = async () => {
    const res = await deleteComment(postId, id);

    if (handleResultWithToast(res)) {
      setComments((prev) => prev.filter((com) => com.id !== id));
    }
  };

  const onClickEdit = () => {
    setActiveComment({ comment, type: "edit" });
  };

  return (
    <div className="flex gap-2 pr-4">
      <div>
        <Avatar size={30} src={userPhotoUrl} />
      </div>
      <div className="grow">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold">{userDisplayName}</h4>
          <p className="text-sm">{text}</p>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-gray-500">
              {new Date(updatedAt || createdAt).toLocaleDateString()}
            </span>
            <button className="text-sm font-bold cursor-pointer hover:underline">
              Reply
            </button>
          </div>
        </div>
      </div>
      <div>
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              isIconOnly
              variant="transparent"
              className="!size-8 !rounded-full bg-transparent">
              <EllipsisVerticalIcon />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onClickEdit}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={onDeleteComment}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Comment;
