import { jwtDecode } from 'jwt-decode';

import { getFromCookies } from '@/lib/helper';

export interface TokenProperty {
  user_id?: string;
  tenant_id?: string;
  fullname?: string;
  email?: string;
  is_active?: string;
  exp?: number;
  iat?: number;
}

export const getTokenData = (): TokenProperty => {
  const token = getFromCookies('authToken');

  if (!token) {
    return {};
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    return {};
  }
};
