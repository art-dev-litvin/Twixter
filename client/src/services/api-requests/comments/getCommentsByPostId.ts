import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { TComment } from "../../../types/comment";
import { apiRequest } from "../../../utils/apiRequest";

export const getCommentsByPostId = (
  postId: string,
  type: "comments" | "replies",
  parentCommentId?: string
): ApiResponse<TComment[]> => {
  return apiRequest<TComment[]>({
    method: "GET",
    url: apiPaths.comments.getAllByPost(postId),
    params: {
      type,
      parentCommentId,
    },
  });
};
