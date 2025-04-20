import { apiPaths } from "../../../constants/api-paths";
import { TPost } from "../../../types/post";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";

export const getPost = async (postId: string): ApiResponse<TPost> => {
  return apiRequest({ method: "GET", url: apiPaths.posts.getOne(postId) });
};
