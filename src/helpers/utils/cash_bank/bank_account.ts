export interface BankAccountProperty {
  currency_code: string | null;
  coa_id: string | null;
  bank_name: string | null;
  branch_name: string | null;
  account_number: string | null;
  account_name: string | null;
  account_type: string | null;
  balance: number | null;
  description: string | null;
}

export const bankAccountInitialState: BankAccountProperty = {
  currency_code: null,
  coa_id: null,
  bank_name: null,
  branch_name: null,
  account_number: null,
  account_name: null,
  account_type: null,
  balance: null,
  description: null,
};

export interface BankAccount {
  pkid: number;
  code: string;
  currency_code: string;
  coa_id: string;
  bank_name: string;
  bank_code: string;
  bank_country: string;
  branch_name: string;
  account_number: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  description: string;
  created_by: string;
  created_date: string;
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
