import { getFromCookies } from '@/lib/helper';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

class FetchService {
  private static createFetchInstance(baseUrl: string | undefined) {
    const token = getFromCookies('authToken') ?? '';

    return async (
      url: string,
      options: FetchOptions = {},
    ): Promise<Response> => {
      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      };

      const mergedOptions: FetchOptions = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(`${baseUrl}${url}`, mergedOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response;
    };
  }

  static get FetchServiceUserManagement() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_USER_MANAGEMENT
        : process.env.NEXT_PUBLIC_API_LOCAL_USER_MANAGEMENT;
    return this.createFetchInstance(baseUrl);
  }
}

export default FetchService;
