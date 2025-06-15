import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

/**
 * Returns the current user's authentication data from cookies
 */
export const getUserData = () => {
  return {
    isAuthenticated: !!Cookies.get('authToken'),
    token: Cookies.get('authToken') || '',
    username: Cookies.get('userName') || '',
    role: Cookies.get('userRole') || '',
    email: Cookies.get('userEmail') || '',
  };
};

/**
 * Sets authentication cookies with proper expiry time
 */
export const setAuthCookies = (data: {
  access_token: string;
  username: string;
  role: string;
  email: string;
  id: string;
}) => {
  // Set expiry to 24 hours (atau sesuai dengan token backend)
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  // Set secure cookies dengan expiry
  Cookies.set('authToken', data.access_token, {
    expires,
    secure: process.env.NODE_ENV === 'production',
  });
  Cookies.set('userName', data.username, {
    expires,
    secure: process.env.NODE_ENV === 'production',
  });
  Cookies.set('userRole', data.role, {
    expires,
    secure: process.env.NODE_ENV === 'production',
  });
  Cookies.set('userEmail', data.email, {
    expires,
    secure: process.env.NODE_ENV === 'production',
  });
  Cookies.set('userId', data.id, {
    expires,
    secure: process.env.NODE_ENV === 'production',
  });
};

export const logout = async () => {
  const { token } = getUserData();

  try {
    if (token) {
      await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  } catch (error) {
    // Tetap lanjutkan logout client-side bahkan jika API gagal
  } finally {
    // Hapus semua auth cookies
    Cookies.remove('authToken');
    Cookies.remove('userName');
    Cookies.remove('userRole');
    Cookies.remove('userEmail');
    Cookies.remove('userId');

    // Hapus flag session untuk next time
    localStorage.removeItem('hadAuthSession');

    // Redirect ke login
    window.location.href = '/auth/login';
  }
};
