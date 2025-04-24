import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserLoading: boolean;
}
export interface AuthProviderProps {
  children: React.ReactNode;
}
