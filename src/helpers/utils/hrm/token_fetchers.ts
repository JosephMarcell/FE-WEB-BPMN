import Cookies from 'js-cookie';

export function getFromCookies(key: string): string | null {
  const cookie = Cookies.get(key);

  if (typeof cookie === 'string') {
    return cookie;
  }
  return null;
}

export const tokenFetcher = () => {
  const token = getFromCookies('authToken');
  return token;
};
