import { auth } from "../../firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { runSafeAsync } from "../../../utils/runSafeAsync";
import { ApiResponse } from "../../../types/api";

const signIn = async (email: string, password: string): ApiResponse<User> => {
  const res = await runSafeAsync(() =>
    signInWithEmailAndPassword(auth, email, password)
  );

  if ("error" in res) return res;

  return res.user;
};

export { signIn };
