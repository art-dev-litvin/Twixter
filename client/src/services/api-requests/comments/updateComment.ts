import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { TComment } from "../../../types/comment";
import { apiRequest } from "../../../utils/apiRequest";

export const updateComment = async (
  postId: string,
  commentId: string,
  fieldsToUpdate: Partial<TComment>
): ApiResponse<TComment> => {
  return apiRequest<TComment>({
    method: "PATCH",
    url: apiPaths.comments.updateOne(postId, commentId),
    data: fieldsToUpdate,
  });
};
