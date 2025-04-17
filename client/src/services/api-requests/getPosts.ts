import axios from "axios";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PostType, PostsSortByType } from "../../types/post";

export const getPosts = async ({
  sortBy,
  limit,
  cursor,
}: {
  sortBy: PostsSortByType | null;
  limit: number;
  cursor: string | null;
}): Promise<
  | { posts: PostType[]; totalCount: number; nextCursor: string }
  | { error: string }
> => {
  try {
    const { data } = await axios.get(apiPaths.posts.getAll, {
      params: {
        limit,
        sortBy,
        cursor,
      },
    });

    const { posts, totalCount, nextCursor } = data;

    return { posts, totalCount, nextCursor };
  } catch (error) {
    return getErrorMessage(error);
  }
};
