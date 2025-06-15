import Cookies from 'js-cookie';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function getFromCookies(key: string): string | null {
  const cookie = Cookies.get(key);

  if (typeof cookie === 'string') {
    return cookie;
  }
  return null;
}
