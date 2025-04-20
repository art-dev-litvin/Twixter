import { toast } from "react-toastify";
import { ApiResponse } from "../types/api";

export function handleResultWithToast<T>(
  result: Awaited<ApiResponse<T>>
): T | undefined {
  if (result && typeof result === "object" && "error" in result) {
    toast.error(result.error);
    return undefined;
  }
  return result;
}
