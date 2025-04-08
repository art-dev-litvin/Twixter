import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const signout = async () => {
  try {
    await signOut(auth);

    return { result: "Signed out!" };
  } catch {
    return { error: "Failed to sign out" };
  }
};

export { signout };
