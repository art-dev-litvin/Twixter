import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { runSafeAsync } from "../../../utils/runSafeAsync";
import { ApiResponse } from "../../../types/api";

const handleForgotPassword = async (email: string): ApiResponse<{}> => {
  await runSafeAsync<void>(() => sendPasswordResetEmail(auth, email));

  return {};
};

export { handleForgotPassword };
