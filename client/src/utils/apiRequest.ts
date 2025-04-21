import axios, { AxiosRequestConfig } from "axios";
import { runSafeAsync } from "./runSafeAsync";
import { ApiResponse } from "../types/api";
import { auth } from "../services/firebase";

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): ApiResponse<T> => {
  return runSafeAsync(async () => {
    const authToken = await auth.currentUser?.getIdToken(true);

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    return await axios
      .request<T>({ headers, ...config })
      .then((res) => res.data);
  });
};
