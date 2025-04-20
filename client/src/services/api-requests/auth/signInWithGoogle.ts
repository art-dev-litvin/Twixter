import { signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { ApiResponse } from "../../../types/api";
import { runSafeAsync } from "../../../utils/runSafeAsync";

const signInWithGoogle = async (): ApiResponse<User> => {
  const res = await runSafeAsync(() => signInWithPopup(auth, googleProvider));

  if ("error" in res) return res;

  return res.user;
};

export { signInWithGoogle };
