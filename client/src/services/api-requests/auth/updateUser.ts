import { User } from "firebase/auth";
import { apiPaths } from "../../../constants/api-paths";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";

const updateUser = async ({
  username,
  newPassword,
  userId,
  updatedImageUrl,
}: {
  username?: string;
  newPassword?: string;
  updatedImageUrl?: string;
  userId: string;
}): ApiResponse<User> => {
  return apiRequest<User>({
    method: "POST",
    url: apiPaths.auth.updateProfile,
    data: {
      username,
      updatedImageUrl,
      newPassword,
      userId,
    },
  });
};

export { updateUser };
