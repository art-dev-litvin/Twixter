import { AxiosError } from "axios";
import { FirebaseError } from "firebase/app";

const getErrorMessage = (error: any) => {
  if (error instanceof FirebaseError) {
    return { error: error.message };
  } else if (error instanceof AxiosError) {
    return { error: error.response?.data?.message };
  } else if (error instanceof Error) {
    return { error: error.message };
  } else {
    return { error: "Unexpected error occurred" };
  }
};

export { getErrorMessage };
