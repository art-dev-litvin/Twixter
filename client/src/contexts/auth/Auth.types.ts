import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  isSignedOut: boolean;
  setIsSignedOut: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface AuthProviderProps {
  children: React.ReactNode;
}
