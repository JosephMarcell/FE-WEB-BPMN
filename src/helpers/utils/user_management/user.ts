export interface UserProperty {
  role_id: number;
  username: string;
  email: string;
  password: string;
  password_attempt_counter: number;
  password_last_update_time?: Date;
  reset_token?: string;
  fullname?: string;
  image_url?: string;
}
