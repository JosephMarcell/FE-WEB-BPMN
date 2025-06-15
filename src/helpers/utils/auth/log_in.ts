export interface LogInProperty {
  ip: string;
  email: string;
  password: string;
}

export interface LogInResult {
  token: string;
}

export const logInInitialState: LogInProperty = {
  ip: '',
  email: '',
  password: '',
};
