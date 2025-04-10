import { User } from "firebase/auth";
import axios from "axios";
import { apiPaths } from "../../constants/api-paths";
import { fileToBase64 } from "../../utils/fileToBase64";
import { getErrorMessage } from "../../utils/getErrorMessage";

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
}): Promise<{ result: string; updatedUser: User } | { error: string }> => {
  let profileImageBase64: string | undefined;

  if (profileImage) {
    profileImageBase64 = await fileToBase64(profileImage);
  }

  try {
    const { data } = await axios.post<{ result: string; updatedUser: User }>(
      apiPaths.auth.updateProfile,
      {
        username,
        newPassword,
        profileImageBase64,
        uid,
      }
    );

    return { result: data.result, updatedUser: data.updatedUser };
  } catch (error) {
    return getErrorMessage(error);
  }
};

export { updateUser };
