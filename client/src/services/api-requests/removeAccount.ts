import { getAuth, deleteUser } from "firebase/auth";

const removeAccount = async (): Promise<{
  result?: string;
  error?: string;
}> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await deleteUser(user);

      return { result: "Account successfully removed." };
    } catch (error) {
      if ((error as { code: string }).code === "auth/requires-recent-login") {
        return { error: "Reauthentication required. Please log in again." };
      }

      return { error: "Failed to remove account" };
    }
  } else {
    return { error: "No user is currently signed in." };
  }
};

export { removeAccount };
