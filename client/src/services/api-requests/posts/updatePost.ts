import { apiPaths } from "../../../constants/api-paths";
import { TPost } from "../../../types/post";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";
import { PostFormFields } from "../../../components/PostForm/schema";

const updatePost = async (
  postId: string,
  values: PostFormFields
): ApiResponse<TPost> => {
  return apiRequest<TPost>({
    method: "PATCH",
    url: apiPaths.posts.updateOne(postId),
    data: values,
  });
};

export { updatePost };
