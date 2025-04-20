import { apiPaths } from "../../../constants/api-paths";
import { UpdatePostDto, TPost } from "../../../types/post";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";

const updatePost = async (
  postId: string,
  values: UpdatePostDto
): ApiResponse<TPost> => {
  return apiRequest<TPost>({
    method: "PATCH",
    url: apiPaths.posts.updateOne(postId),
    data: values,
  });
};

export { updatePost };
