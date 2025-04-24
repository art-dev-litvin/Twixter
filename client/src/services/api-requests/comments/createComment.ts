import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { CreateCommentDto, TComment } from "../../../types/comment";
import { apiRequest } from "../../../utils/apiRequest";

export const createComment = (
  createCommentDto: CreateCommentDto
): ApiResponse<{ newComment: TComment; updatedCommentsCount: number }> => {
  return apiRequest({
    method: "POST",
    url: apiPaths.comments.new,
    data: createCommentDto,
  });
};
