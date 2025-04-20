import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";

export const removePost = async (postId: string): ApiResponse<{}> => {
  await apiRequest({
    method: "DELETE",
    url: apiPaths.posts.deleteOne(postId),
  });

  return {};
};
