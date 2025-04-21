import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";

export const deleteComment = async (
  postId: string,
  commentId: string
): ApiResponse<{}> => {
  await apiRequest<{}>({
    method: "DELETE",
    url: apiPaths.comments.deleteOne(postId, commentId),
  });

  return {};
};
