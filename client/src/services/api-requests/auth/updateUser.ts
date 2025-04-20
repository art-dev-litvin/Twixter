import { User } from "firebase/auth";
import { apiPaths } from "../../../constants/api-paths";
import { fileToBase64 } from "../../../utils/fileToBase64";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";

const updateUser = async ({
  username,
  newPassword,
  profileImage,
  uid,
}: {
  username?: string;
  newPassword?: string;
  profileImage?: File;
  uid: string;
}): ApiResponse<User> => {
  let profileImageBase64: string | undefined;

  if (profileImage) {
    profileImageBase64 = await fileToBase64(profileImage);
  }

  return apiRequest<User>({
    method: "POST",
    url: apiPaths.auth.updateProfile,
    data: {
      username,
      newPassword,
      profileImageBase64,
      uid,
    },
  });
};

export { updateUser };
