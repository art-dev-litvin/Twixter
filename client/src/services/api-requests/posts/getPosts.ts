import { apiPaths } from "../../../constants/api-paths";
import { TPost, PostsSortByType } from "../../../types/post";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";

export const getPosts = async ({
  sortBy,
  limit,
  cursor,
  query,
  page,
}: {
  sortBy: PostsSortByType;
  limit: number;
  cursor: string | null;
  query: string;
  page: number;
}): ApiResponse<{ posts: TPost[]; totalPosts: number }> => {
  return apiRequest({
    method: "GET",
    url: apiPaths.posts.getAll,
    params: { limit, sortBy, cursor, query, page },
  });
};
