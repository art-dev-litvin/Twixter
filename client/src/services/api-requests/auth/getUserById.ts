import { apiPaths } from "../../../constants/api-paths";
import { ApiResponse } from "../../../types/api";
import { apiRequest } from "../../../utils/apiRequest";
import { User } from "firebase/auth";

export const getUserById = async (userId: string): ApiResponse<User> => {
  return apiRequest<User>({
    method: "GET",
    url: apiPaths.auth.getUserById(userId),
  });
};
