import Avatar from "../Avatar";
import {
  EllipsisVerticalIcon,
  MessageSquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Button from "../Button";
import { PostType } from "../../types/post";
import Dropdown from "../Dropdown";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { routes } from "../../constants/routes";

interface PostProps {
  post: PostType;
  maxWidth?: number | string;
}

function Post({
  post: {
    id,
    title,
    content,
    createdAt,
    imageUrl,
    userId,
    userDisplayName,
    userPhotoUrl,
    comments,
    rating,
  },
  maxWidth,
}: PostProps) {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const onClickEditPost = () => {
    navigate(routes.editPost(id));
  };

  return (
    <>
      <div
        className="shadow-md bg-slate-50 p-4 rounded-xl mb-4 break-inside-avoid"
        style={{ maxWidth: maxWidth || "100%" }}>
        <header className="flex justify-between gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Avatar src={userPhotoUrl} size={40} />
            <span className="font-bold">{userDisplayName}</span>
          </div>

          {currentUser && currentUser.uid === userId && (
            <Dropdown>
              <Dropdown.Trigger>
                <Button className="!size-8" isIconOnly variant="transparent">
                  <EllipsisVerticalIcon className="shrink-0" />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onClickEditPost}>Edit</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </header>
        <section className="mt-4">
          <h3 className="font-bold text-lg">{title}</h3>
          {imageUrl && (
            <div className="h-80 w-full my-4">
              <img
                className="object-cover rounded-lg size-full"
                src={imageUrl}
                alt={title}
              />
            </div>
          )}
          <p className="mt-2 text-base">{content}</p>
        </section>
        <div className="mt-4 flex justify-between">
          <div className="flex gap-4">
            <Button className="!size-11 gap-1" isIconOnly variant="transparent">
              <ThumbsUpIcon className="shrink-0 size-5" />
              {rating.likes}
            </Button>

            <Button className="!size-11 gap-1" isIconOnly variant="transparent">
              <ThumbsDownIcon className="shrink-0 size-5" />
              {rating.dislikes}
            </Button>
          </div>
          <div>
            <Button className="!size-8 gap-1" isIconOnly variant="transparent">
              <MessageSquareIcon className="shrink-0 size-5" />
              {comments.length}
            </Button>
          </div>
        </div>
        <p className="text-end text-sm text-slate-600">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </>
  );
}

export default Post;
