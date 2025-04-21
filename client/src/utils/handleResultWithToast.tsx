import { toast } from "react-toastify";
import { ApiResponse } from "../types/api";

export function handleResultWithToast<T>(
  result: Awaited<ApiResponse<T>>,
  hideToast?: boolean
): T | undefined {
  if (result && typeof result === "object" && "error" in result) {
    if (!hideToast) toast.error(result.error);
    return undefined;
  }
  return result;
}
