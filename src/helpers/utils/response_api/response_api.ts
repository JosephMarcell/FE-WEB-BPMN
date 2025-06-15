export interface ApiResponse<T> {
  data: T;
  message: string;
  returnId?: number | string;
  isSuccess: boolean;
  status: number;
}

export interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export function isErrorResponse(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const response = (error as { response?: unknown }).response;
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const data = (response as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return 'message' in data;
}
