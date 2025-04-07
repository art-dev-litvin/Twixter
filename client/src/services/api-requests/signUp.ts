import axios, { AxiosError } from "axios";
import { auth } from "../firebase";
import {
  sendEmailVerification,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import { apiPaths } from "../../constants/api-paths";

const signUp = async (
  username: string,
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> => {
  try {
    const { data } = await axios.post(apiPaths.auth.signUp, {
      username,
      email,
      password,
    });

    const { user: loggedInUser } = await signInWithCustomToken(
      auth,
      data.customToken
    );
    await sendEmailVerification(loggedInUser);

    return {
      user: loggedInUser,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { error: error.response?.data?.message };
    } else if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Unexpected error occurred" };
    }
  }
};

export { signUp };
