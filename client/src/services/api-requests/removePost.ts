import axios from "axios";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const removePost = async (
  postId: string
): Promise<void | { error: string }> => {
  try {
    await axios.delete(apiPaths.posts.deleteOne(postId));
  } catch (error) {
    return getErrorMessage(error);
  }
};
