import { sendPasswordResetEmail } from "firebase/auth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { auth } from "../firebase";

const handleForgotPassword = async (
  email: string
): Promise<{ result: string } | { error: string }> => {
  try {
    await sendPasswordResetEmail(auth, email);

    return { result: "Password reset email sent!" };
  } catch (error) {
    return getErrorMessage(error);
  }
};

export { handleForgotPassword };
