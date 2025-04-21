import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";
import { TRating, UpdateRatingDto } from "../../../types/rating";

export const updateRating = async (
  updateRatingDto: UpdateRatingDto
): ApiResponse<TRating> => {
  return apiRequest({
    method: "POST",
    url: apiPaths.rating.update,
    data: updateRatingDto,
  });
};
