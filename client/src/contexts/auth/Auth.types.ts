import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export interface AuthProviderProps {
  children: React.ReactNode;
}
