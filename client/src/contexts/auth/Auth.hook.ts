import React from "react";
import { AuthContext } from "./Auth.context";

export const useAuth = () => {
  return React.useContext(AuthContext);
};
