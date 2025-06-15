import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import Cookies from 'js-cookie';

import { getFromCookies } from '@/lib/helper';

dotenv.config();

class AxiosService {
  private static createAxiosInstance(baseUrl: string | undefined) {
    return axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private static createAxiosInstanceWithAuth(baseUrl: string | undefined) {
    const token = getFromCookies('authToken') ?? '';

    return axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
  }

  private static createAxiosInstanceWithAuthContext(
    baseUrl: string | undefined,
  ) {
    const token = getFromCookies('authToken') ?? '';
    const router = getFromCookies('router') ?? '';
    const router_segment = router.split(':');

    const axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'X-Module': router_segment[0],
        'X-Router': router_segment[1],
      },
    });

    return axiosInstance;
  }

  private static createAuthAxiosInstance(baseUrl: string): AxiosInstance {
    const instance = axios.create({
      baseURL: baseUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(
      config => {
        const token = Cookies.get('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`; // Format harus tepat
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Perbaiki interceptor response
    instance.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        // Jangan redirect otomatis untuk request login yang gagal
        const isLoginRequest = error.config.url.includes('/api/auth/login');

        // Handle 401 errors - token expired or invalid, tapi bukan dari request login
        if (
          !isLoginRequest &&
          error.response &&
          (error.response.status === 401 ||
            error.response.data?.error === 'Unauthorized')
        ) {
          // Remove auth cookies
          Cookies.remove('authToken');
          Cookies.remove('userName');
          Cookies.remove('userRole');
          Cookies.remove('userEmail');
          Cookies.remove('userId');

          // Set flag session pernah ada untuk tampilkan pesan session expired
          localStorage.setItem('hadAuthSession', 'true');

          // Redirect to login page
          window.location.href = '/auth/login?sessionExpired=true';
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }

  // Regular instance for non-authenticated requests
  public static get AxiosServiceUserManagement(): AxiosInstance {
    // Gunakan createAuthAxiosInstance yang sudah ada dengan interceptor
    return this.createAuthAxiosInstance(
      'https://lecsens-iot-api.erplabiim.com',
    );
  }

  static get AxiosServiceInventory() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_INVENTORY
        : process.env.NEXT_PUBLIC_API_LOCAL_INVENTORY;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceManufacturing() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_MANUFACTURING
        : process.env.NEXT_PUBLIC_API_LOCAL_MANUFACTURING;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceAccountPayable() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_ACCOUNT_PAYABLE
        : process.env.NEXT_PUBLIC_API_LOCAL_ACCOUNT_PAYABLE;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceAccountReceivable() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_ACCOUNT_RECEIVABLE
        : process.env.NEXT_PUBLIC_API_LOCAL_ACCOUNT_RECEIVABLE;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceCashBank() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_CASH_BANK
        : process.env.NEXT_PUBLIC_API_LOCAL_CASH_BANK;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceHRM() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_HRM
        : process.env.NEXT_PUBLIC_API_LOCAL_HRM;
    return this.createAxiosInstanceWithAuthContext(baseUrl);
  }

  static get AxiosServiceFixedAsset() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_FIXED_ASSET
        : process.env.NEXT_PUBLIC_API_LOCAL_FIXED_ASSET;
    return this.createAxiosInstanceWithAuth(baseUrl);
  }

  static get AxiosServiceViolations() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_VIOLATIONS
        : process.env.NEXT_PUBLIC_API_LOCAL_VIOLATIONS;
    return this.createAxiosInstanceWithAuth(baseUrl);
  }

  static get AxiosServicePurchasing() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_PURCHASING
        : process.env.NEXT_PUBLIC_API_LOCAL_PURCHASING;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceSales() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_SALES
        : process.env.NEXT_PUBLIC_API_LOCAL_SALES;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceGeneralSystem() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_GENERAL_SYSTEM
        : process.env.NEXT_PUBLIC_API_LOCAL_GENERAL_SYSTEM;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceGeneralLedger() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_GENERAL_LEDGER
        : process.env.NEXT_PUBLIC_API_LOCAL_GENERAL_LEDGER;
    return this.createAxiosInstance(baseUrl);
  }

  static get AxiosServiceScheduling() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_DEV_SCHEDULING
        : process.env.NEXT_PUBLIC_API_LOCAL_SCHEDULING;
    return this.createAxiosInstance(baseUrl);
  }
}

export default AxiosService;
