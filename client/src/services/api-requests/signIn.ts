import { auth } from "../firebase";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { signInWithEmailAndPassword, User } from "firebase/auth";

const signIn = async (
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> => {
  try {
    const { user: loggedInUser } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      user: loggedInUser,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      switch (error.code) {
        case "auth/invalid-credential":
          return { error: "Invalid credential" };
        case "auth/invalid-email":
          return { error: "Invalid email address." };
        case "auth/user-disabled":
          return { error: "This user account has been disabled." };
        case "auth/user-not-found":
          return { error: "No user found with this email." };
        case "auth/wrong-password":
          return { error: "Incorrect password." };
        default:
          console.dir(error);
          return { error: "An unknown error occurred." };
      }
    }

    return getErrorMessage(error);
  }
};

export { signIn };
