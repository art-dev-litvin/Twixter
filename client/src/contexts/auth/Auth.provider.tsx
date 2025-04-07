import React from "react";
import { AuthContext } from "./Auth.context";
import { AuthProviderProps } from "./Auth.types";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
