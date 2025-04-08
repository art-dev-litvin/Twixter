import { signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { getErrorMessage } from "../../utils/getErrorMessage";

const signInWithGoogle = async (): Promise<{ user?: User; error?: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return { user };
  } catch (error) {
    return getErrorMessage(error);
  }
};

export { signInWithGoogle };
