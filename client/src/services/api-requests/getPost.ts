import axios from "axios";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PostType } from "../../types/post";

export const getPost = async (
  postId: string
): Promise<{ post: PostType } | { error: string }> => {
  try {
    const { data } = await axios.get(apiPaths.posts.getOne(postId));

    const { post } = data;

    return { post };
  } catch (error) {
    return getErrorMessage(error);
  }
};
