export interface CashAccountProperty {
  currency_code: string | null;
  coa_id: string | null;
  cash_name: string | null;
  account_name: string | null;
  account_type: string | null;
  balance: number | null;
  description: string | null;
}

export const cashAccountInitialState: CashAccountProperty = {
  currency_code: null,
  coa_id: null,
  cash_name: null,
  account_name: null,
  account_type: null,
  balance: null,
  description: null,
};

export interface CashAccount {
  pkid: number;
  code: string;
  currency_code: string;
  coa_id: string;
  cash_name: string;
  description: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  created_by: string;
  created_date: string;
  updated_by?: string | null;
  updated_date?: string | null;
  updated_host?: string | null;
  is_deleted?: string | null;
  deleted_by?: string | null;
  deleted_date?: string | null;
  deleted_host?: string | null;
  action?: string;
  [key: string]: unknown;
}

export interface Currency {
  pkid: number;
  code: string;
  name: string;
  symbol: string;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: string | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export interface Coa {
  pkid: string;
  name: string;
}

export interface AccountTypeOption {
  value: string;
  label: string;
}
