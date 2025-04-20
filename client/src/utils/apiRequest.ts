import axios, { AxiosRequestConfig } from "axios";
import { runSafeAsync } from "./runSafeAsync";
import { ApiResponse } from "../types/api";

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): ApiResponse<T> => {
  return runSafeAsync(async () => {
    return await axios.request<T>(config).then((res) => res.data);
  });
};
