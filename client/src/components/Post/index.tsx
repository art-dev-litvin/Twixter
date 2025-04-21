import Avatar from "../Avatar";
import {
  EllipsisVerticalIcon,
  MessageSquareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Button from "../Button";
import { TPost } from "../../types/post";
import Dropdown from "../Dropdown";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { routes } from "../../constants/routes";
import RemovePost from "../RemovePost";
import React from "react";
import { usePostsUpdates } from "../../contexts/postsUpdates/postsUpdates.hook";
import Popup from "../Popup";
import Comments from "../Comments";

interface PostProps {
  post: TPost;
  maxWidth?: number | string;
}

function Post({ post, maxWidth }: PostProps) {
  const {
    id,
    title,
    content,
    createdAt,
    imageUrl,
    userId,
    userDisplayName,
    userPhotoUrl,
  } = post;

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { setShouldUpdatePosts } = usePostsUpdates();
  const [isOpenComments, setIsOpenComments] = React.useState(false);

  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const changeCommentsPopupOpen = (newOpen: boolean) => () => {
    setIsOpenComments(newOpen);
  };

  const changeDropdownOpen = (newOpen: boolean) => {
    setIsDropdownOpen(newOpen);
  };

  const onClickEditPost = () => {
    navigate(routes.editPost(id));
  };

  const onRemovePost = async () => {
    changeDropdownOpen(false);
    console.log("should update");
    setShouldUpdatePosts(true);
  };

  return (
    <>
      <div
        className="shadow-md bg-slate-50 p-4 rounded-xl mb-4 break-inside-avoid"
        style={{ maxWidth: maxWidth || "100%" }}>
        <header className="flex justify-between gap-4 items-center">
          <div className="relative flex gap-2 items-center">
            <a
              className="absolute size-full top-0 left-0 z-10"
              href={routes.userById(userId)}></a>
            <Avatar src={userPhotoUrl} size={40} />
            <span className="font-bold">{userDisplayName}</span>
          </div>

          {currentUser && currentUser.uid === userId && (
            <Dropdown changeOpen={changeDropdownOpen} open={isDropdownOpen}>
              <Dropdown.Trigger>
                <Button className="!size-8" isIconOnly variant="transparent">
                  <EllipsisVerticalIcon className="shrink-0" />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onClickEditPost}>Edit</Dropdown.Item>
                <RemovePost onRemovePost={onRemovePost} post={post} />
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
              {0}
            </Button>

            <Button className="!size-11 gap-1" isIconOnly variant="transparent">
              <ThumbsDownIcon className="shrink-0 size-5" />
              {0}
            </Button>
          </div>
          <div>
            <Button
              onClick={changeCommentsPopupOpen(true)}
              className="!size-8 gap-1"
              isIconOnly
              variant="transparent">
              <MessageSquareIcon className="shrink-0 size-5" />
              {0}
            </Button>

            <Popup
              open={isOpenComments}
              onClose={changeCommentsPopupOpen(false)}>
              <Comments postId={id} isOpenedComments={isOpenComments} />
            </Popup>
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
