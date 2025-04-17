import axios from "axios";
import { PostType } from "../../types/post";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const getUserPosts = async (
  userId: string
): Promise<{ posts: PostType[] } | { error: string }> => {
  try {
    const { data } = await axios.get(apiPaths.posts.getAllByUser(userId));

    const { posts } = data;

    return { posts };
  } catch (error) {
    return getErrorMessage(error);
  }
};
