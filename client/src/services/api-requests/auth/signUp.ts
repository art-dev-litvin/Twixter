import { auth } from "../../firebase";
import {
  sendEmailVerification,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import { apiPaths } from "../../../constants/api-paths";
import { apiRequest } from "../../../utils/apiRequest";
import { ApiResponse } from "../../../types/api";
import { runSafeAsync } from "../../../utils/runSafeAsync";

const signUp = async (
  username: string,
  email: string,
  password: string
): ApiResponse<User> => {
  const authTokenData = await apiRequest<string>({
    method: "POST",
    url: apiPaths.auth.signUp,
    data: {
      username,
      email,
      password,
    },
  });

  if (typeof authTokenData !== "string") {
    // {error: string}
    return authTokenData;
  }

  return runSafeAsync(async () => {
    const { user } = await signInWithCustomToken(auth, authTokenData);
    await sendEmailVerification(user);

    return user;
  });
};

export { signUp };
