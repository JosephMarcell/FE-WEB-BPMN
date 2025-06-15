export interface UserListProperty {
  // pkid: number | null;
  username: string | null;
  email: string | null;
  password: string | null;
  confirm_pwd: string | null;
  nik: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar: string | null;
  gender: string | null;
  // login_attempts: number | null;
  // suspended_until: Date | null;
  // otp: number | null;
  // otp_sent: number | null;
  // role_pkid: number | null;
  role: number | null;
  // office_pkid: number | null;
  office: number | null;
  // created_by: string | null;
  // created_host: string | null;
  // updated_by: string | null;
  // updated_host: string | null;
  // deleted_by: string | null;
  // deleted_host: string | null;
  // is_deleted: boolean;
  // created_at: Date | null;
  // updated_at: Date | null;
  // deleted_at: Date | null;
  is_verified: boolean | null;
  full_name?: string | null;
  alamat?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  [key: string]: any; // <-- tambahkan baris ini jika ingin akses dinamis
}

export const userListInitialState: UserListProperty = {
  // pkid: null,
  username: null,
  email: null,
  password: null,
  confirm_pwd: null,
  nik: null,
  first_name: null,
  last_name: null,
  gender: null,
  avatar: null,
  is_verified: false,
  // login_attempts: null,
  // suspended_until: null,
  // otp: null,
  // otp_sent: null,
  // role_pkid: null,
  role: null,
  // office_pkid: null,
  office: null,
  // created_by: null,
  // created_host: null,
  // updated_by: null,
  // updated_host: null,
  // deleted_by: null,
  // deleted_host: null,
  // is_deleted: false,
  // created_at: null,
  // updated_at: null,
  // deleted_at: null,
  full_name: null,
  alamat: null,
  latitude: null,
  longitude: null,
};
