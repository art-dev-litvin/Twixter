import React from "react";
import { CreateCommentDto, TComment } from "../../types/comment";
import Comment from "./Comment";
import Input from "../Input";
import Button from "../Button";
import { SendIcon } from "lucide-react";
import { auth } from "../../services/firebase";
import { createComment } from "../../services/api-requests/comments/createComment";
import { toast } from "react-toastify";
import classNames from "classnames";
import { handleResultWithToast } from "../../utils/handleResultWithToast";
import { getCommentsByPostId } from "../../services/api-requests/comments/getCommentsByPostId";
import { updateComment } from "../../services/api-requests/comments/updateComment";

interface CommentsProps {
  postId: string;
  isOpenedComments: boolean;
  setPostCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}

function Comments({
  postId,
  isOpenedComments,
  setPostCommentsCount,
}: CommentsProps) {
  const [commentInputValue, setCommentInputValue] = React.useState("");
  const [comments, setComments] = React.useState<TComment[]>([]);
  const [activeComment, setActiveComment] = React.useState<{
    comment: TComment | null;
    type: "reply" | "edit" | null;
  }>({ comment: null, type: null });
  const [myReplies, setMyReplies] = React.useState<
    { parentCommentId: string; replies: TComment[] }[]
  >([]);

  const fetchComments = React.useCallback(async () => {
    const res = await getCommentsByPostId(postId, "comments");

    const data = handleResultWithToast(res);

    if (data) {
      setComments(data);
    }
  }, []);

  React.useEffect(() => {
    if (isOpenedComments && !comments.length) {
      fetchComments();
    }
  }, [isOpenedComments]);

  const onCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInputValue(e.target.value);
  };

  const handleSendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("You are not authenticated");
      return;
    }

    if (commentInputValue && commentInputValue.trim()) {
      const createCommentDto: CreateCommentDto = {
        text: commentInputValue,
        type: "comment",
        ...(activeComment.type === "reply" &&
          activeComment.comment && {
            parentCommentId: activeComment.comment.id,
            type: "reply",
          }),
        postId: postId,
        user: currentUser,
      };

      const res = await createComment(createCommentDto);

      const data = handleResultWithToast(res, true);

      if (data) {
        setCommentInputValue("");
        setPostCommentsCount(data.updatedCommentsCount);

        if (activeComment.type === "reply") {
          setMyReplies((prev) => {
            const existingReplies = prev.find(
              (reply) => reply.parentCommentId === activeComment.comment!.id
            );

            if (existingReplies) {
              return prev.map((reply) =>
                reply.parentCommentId === activeComment.comment!.id
                  ? {
                      ...reply,
                      replies: [data.newComment, ...reply.replies],
                    }
                  : reply
              );
            }

            return [
              {
                parentCommentId: activeComment.comment!.id,
                replies: [data.newComment],
              },
              ...prev,
            ];
          });
          setActiveComment({ comment: null, type: null });
        } else {
          setComments((prev) => [data.newComment, ...prev]);
        }
      }
    }
  };

  const handleEditComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (activeComment.type !== "edit") return;

    const res = await updateComment(postId, activeComment.comment!.id, {
      text: commentInputValue,
    });

    const updatedComment = handleResultWithToast(res);

    if (updatedComment) {
      setCommentInputValue("");
      setActiveComment({ comment: null, type: null });

      setComments((prev) =>
        prev.map((com) => {
          if (com.id === updatedComment.id) {
            return updatedComment;
          }
          return com;
        })
      );
    }
  };

  return (
    <div className="w-[500px] max-h-[400px]">
      <h2 className="font-bold text-xl">Comments:</h2>
      <div
        className={classNames("mt-4 h-[300px] pb-[60px]", {
          "flex flex-row justify-center items-center": !comments.length,
        })}>
        {!comments.length && <p>No comments yet 🐑</p>}
        <div className="overflow-y-auto h-full flex flex-col gap-4">
          {comments.map((comment) => (
            <Comment
              setPostCommentsCount={setPostCommentsCount}
              myReplies={myReplies}
              setActiveComment={setActiveComment}
              key={comment.id}
              postId={postId}
              setComments={setComments}
              comment={comment}
            />
          ))}
        </div>
      </div>
      <form
        onSubmit={
          activeComment.type === "edit" ? handleEditComment : handleSendComment
        }
        className="bg-white rounded-lg  px-3 h-[70px] flex items-center absolute bottom-0 left-0 w-full border-t border-gray-300">
        <Input
          value={commentInputValue}
          onChange={onCommentInputChange}
          placeholder={
            activeComment.type === "edit"
              ? "Edit comment..."
              : activeComment.type === "reply"
              ? "Reply comment"
              : "Add comment..."
          }
        />

        <Button
          isIconOnly
          className="absolute top-1/2 -translate-y-1/2 right-4 size-9 min-h-9">
          <SendIcon className="size-6" />
        </Button>
      </form>
    </div>
  );
}

export default Comments;
