import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";
import { TRating } from "../../../types/rating";

export const getRating = async (postId: string): ApiResponse<TRating> => {
  return apiRequest({
    method: "GET",
    url: apiPaths.rating.getCountByPostId(postId),
  });
};
