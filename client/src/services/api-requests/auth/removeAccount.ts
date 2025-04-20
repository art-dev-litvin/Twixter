import { getAuth, deleteUser } from "firebase/auth";
import { ApiResponse } from "../../../types/api";
import { runSafeAsync } from "../../../utils/runSafeAsync";

const removeAccount = async (): ApiResponse<{}> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return { error: "No user is currently signed in." };

  await runSafeAsync(() => deleteUser(user));

  return {};
};

export { removeAccount };
