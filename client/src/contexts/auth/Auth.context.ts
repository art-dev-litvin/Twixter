import React from "react";
import { AuthContextType } from "./Auth.types";

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
