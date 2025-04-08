import axios from "axios";
import { auth } from "../firebase";
import {
  sendEmailVerification,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import { apiPaths } from "../../constants/api-paths";
import { getErrorMessage } from "../../utils/getErrorMessage";

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
    return getErrorMessage(error);
  }
};

export { signUp };
