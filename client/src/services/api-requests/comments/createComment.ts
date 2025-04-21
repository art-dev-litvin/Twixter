import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { CreateCommentDto, TComment } from "../../../types/comment";
import { apiRequest } from "../../../utils/apiRequest";

export const createComment = (
  createCommentDto: CreateCommentDto
): ApiResponse<TComment> => {
  return apiRequest<TComment>({
    method: "POST",
    url: apiPaths.comments.new,
    data: createCommentDto,
  });
};
