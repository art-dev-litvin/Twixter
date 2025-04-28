import { User } from "firebase/auth";
import { apiPaths } from "../../../constants/api-paths";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";

const updateUser = async ({
  username,
  newPassword,
  userId,
  userImageUrl,
}: {
  username?: string;
  newPassword?: string;
  userImageUrl?: string;
  userId: string;
}): ApiResponse<User> => {
  return apiRequest<User>({
    method: "POST",
    url: apiPaths.auth.updateProfile,
    data: {
      username,
      userImageUrl,
      newPassword,
      userId,
    },
  });
};

export { updateUser };
