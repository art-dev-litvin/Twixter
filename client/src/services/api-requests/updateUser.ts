import { updatePassword, updateProfile, User } from "firebase/auth";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

const updateUser = async ({
  username,
  newPassword,
}: {
  username?: string;
  newPassword?: string;
}): Promise<{ result: string; updatedUser: User } | { error: string }> => {
  const user = auth.currentUser;

  if (user) {
    try {
      await updateProfile(user, {
        displayName: username || user.displayName,
      });

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      return { result: "Profile edited successfully!", updatedUser: user };
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/requires-recent-login":
            return { error: "To change the password you should login again" };
          default:
            return { error: error.message };
        }
      } else if (error instanceof Error) {
        return { error: error.message };
      }
    }
  }

  return { error: "No user is currently signed in" };
};

export { updateUser };
