import { EllipsisVerticalIcon } from "lucide-react";
import { TComment } from "../../types/comment";
import Avatar from "../Avatar";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { deleteComment } from "../../services/api-requests/comments/deleteComment";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import React from "react";
import { getCommentsByPostId } from "../../services/api-requests/comments/getCommentsByPostId";
import { auth } from "../../services/firebase";
import { TMyReplies } from ".";

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
  isReply?: boolean;
  myReplies: {
    parentCommentId: string;
    replies: TComment[];
  }[];
  setMyReplies: React.Dispatch<React.SetStateAction<TMyReplies>>;
  setPostCommentsCount: React.Dispatch<React.SetStateAction<number>>;
  focusAddCommentInput: () => void;
}

function Comment(props: CommentProps) {
  const {
    comment,
    postId,
    setComments,
    setActiveComment,
    isReply,
    myReplies,
    setMyReplies,
    setPostCommentsCount,
    focusAddCommentInput,
  } = props;
  const {
    id,
    text,
    createdAt,
    updatedAt,
    userDisplayName,
    userId,
    userPhotoUrl,
  } = comment;
  const currentUserId = auth.currentUser?.uid;
  const [areAllRepliesShown, setAreAllRepliesShown] = React.useState(false);
  const [allReplies, setAllReplies] = React.useState<TComment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = React.useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = React.useState(false);
  const [isDeletingComment, setIsDeletingComment] = React.useState(false);

  const fetchReplies = React.useCallback(async () => {
    const res = await getCommentsByPostId(postId, "replies", id);

    const data = handleResultWithToast(res);

    setMyReplies([]);
    setIsLoadingReplies(false);

    if (data) {
      setAllReplies(data);
    }
  }, [id, postId]);

  React.useEffect(() => {
    if (areAllRepliesShown) {
      fetchReplies();
    }
  }, [areAllRepliesShown, allReplies.length, fetchReplies]);

  const onDeleteComment = async () => {
    setIsDeletingComment(true);
    setActiveComment({ comment: null, type: null });

    const res = await deleteComment(postId, id);

    const data = handleResultWithToast(res);

    setIsDeletingComment(false);

    if (data) {
      setComments((prev) => prev.filter((com) => com.id !== id));
      setPostCommentsCount(data.updatedCommentsCount);
    }
  };

  const handleMoreActionsOpen = (open: boolean) => {
    setIsMoreActionsOpen(open);
  };

  const onClickEdit = () => {
    setActiveComment({ comment, type: "edit" });
    handleMoreActionsOpen(false);
    focusAddCommentInput();
  };

  const onClickReply = () => {
    setActiveComment({ comment, type: "reply" });
  };

  const onToggleShowReplies = () => {
    if (!areAllRepliesShown && !allReplies.length) {
      setIsLoadingReplies(true);
    }

    if (!areAllRepliesShown && allReplies.length) {
      setMyReplies([]);
    }

    setAreAllRepliesShown((prev) => !prev);
  };

  const myRepliesByCommentId = myReplies.find(
    ({ parentCommentId }) => parentCommentId === comment.id
  );

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
            {!isReply && (
              <button
                onClick={onClickReply}
                className="text-sm font-bold cursor-pointer hover:underline">
                Reply
              </button>
            )}
          </div>

          {!isReply && (
            <>
              {areAllRepliesShown && isLoadingReplies && (
                <p className="text-sm animate-pulse">Loading replies...</p>
              )}
              {areAllRepliesShown &&
                !isLoadingReplies &&
                !allReplies.length &&
                !myReplies.length && <p className="text-sm">No replies yet</p>}
              {myRepliesByCommentId?.replies?.map((reply) => (
                <Comment
                  key={`${postId}-${myRepliesByCommentId.parentCommentId}-${reply.id}`}
                  {...props}
                  isReply
                  comment={reply}
                />
              ))}
              {areAllRepliesShown &&
                allReplies.map((reply) => (
                  <Comment
                    key={`${postId}-${id}-${reply.id}`}
                    {...props}
                    isReply
                    comment={reply}
                  />
                ))}
              <button
                onClick={onToggleShowReplies}
                className="pl-8 relative inline-flex w-fit text-sm font-semibold hover:underline cursor-pointer">
                <span className="bg-black absolute h-[1px] w-6 top-1/2 -translate-y-1/2 left-0" />
                {areAllRepliesShown ? "Hide replies" : "Show all replies"}
              </button>
            </>
          )}
        </div>
      </div>
      {!isReply && currentUserId === userId && (
        <div>
          <Dropdown
            changeOpen={(open) => handleMoreActionsOpen(open)}
            open={isMoreActionsOpen}>
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
              <Dropdown.Item
                disabled={isDeletingComment}
                onClick={onDeleteComment}>
                {isDeletingComment ? "Deleting..." : "Delete"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </div>
  );
}

export default Comment;
