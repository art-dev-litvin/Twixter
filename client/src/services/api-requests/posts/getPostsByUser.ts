import { TPost } from "../../../types/post";
import { apiPaths } from "../../../constants/api-paths";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";

export const getPostsByUser = async (userId: string): ApiResponse<TPost[]> => {
  return apiRequest<TPost[]>({
    method: "GET",
    url: apiPaths.posts.getAllByUser(userId),
  });
};
