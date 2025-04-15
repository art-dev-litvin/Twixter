import axios from "axios";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PostType } from "../../types/post";

export const getPosts = async (): Promise<PostType[] | { error: string }> => {
  try {
    const { data: posts } = await axios.get(apiPaths.posts.getAll, {
      params: {
        limit: 10,
      },
    });

    return posts;
  } catch (error) {
    return getErrorMessage(error);
  }
};
