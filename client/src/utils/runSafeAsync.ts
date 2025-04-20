import { ApiResponse, ApiSuccess } from "../types/api";
import { getErrorMessage } from "./getErrorMessage";

export async function runSafeAsync<T>(fn: () => ApiSuccess<T>): ApiResponse<T> {
  try {
    return await fn();
  } catch (error) {
    return getErrorMessage(error);
  }
}
