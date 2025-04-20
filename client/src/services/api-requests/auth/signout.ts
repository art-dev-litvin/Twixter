import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { runSafeAsync } from "../../../utils/runSafeAsync";
import { ApiResponse } from "../../../types/api";

const signout = async (): ApiResponse<{}> => {
  await runSafeAsync<void>(() => signOut(auth));

  return {};
};

export { signout };
