export type ApiSuccess<T> = T;
export type ApiError = { error: string };
export type ApiResponse<T> = Promise<ApiSuccess<T> | ApiError>;
