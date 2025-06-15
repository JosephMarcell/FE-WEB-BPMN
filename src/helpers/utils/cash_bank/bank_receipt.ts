export interface BankReceiptDetailProperty {
  account: string;
  account_name: string;
  total_amount: number;
  account_value: number;
  account_tax?: number;
  other_account_fees?: number;
}

export const bankReceiptDetailInitialState: BankReceiptDetailProperty = {
  account: '',
  account_name: '',
  total_amount: 0,
  account_value: 0,
  account_tax: 0,
  other_account_fees: 0,
};

export interface BankReceiptProperty {
  code: string;
  bank_account_code: string;
  reference_code?: string;
  receipt_date: string;
  receipt_amount: number;
  payment_method: string;
  admin_fee?: number;
  total: number;
  payment_type: string;
  payment_reference?: string;
  additional_notes?: string;
  details: BankReceiptDetailProperty[];
}

export const bankReceiptInitialState: BankReceiptProperty = {
  code: '',
  bank_account_code: '',
  reference_code: '',
  receipt_date: '',
  receipt_amount: 0,
  payment_method: '',
  admin_fee: 0,
  total: 0,
  payment_type: '',
  payment_reference: '',
  additional_notes: '',
  details: [],
};

export interface BankReceipt {
  pkid: number;
  code: string;
  bank_account_code: string;
  reference_code?: string;
  receipt_date: string;
  receipt_amount: number;
  payment_method: string;
  admin_fee?: number;
  total: number;
  payment_type: string;
  payment_reference?: string;
  additional_notes?: string;
  created_by: string;
  created_date: string;
  updated_by?: string;
  updated_date?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: string;
  deleted_host?: string;
  details: BankReceiptDetailProperty[];
}

export interface BankReceiptData
  extends Omit<
    BankReceipt,
    'reference_code' | 'payment_reference' | 'additional_notes' | 'admin_fee'
  > {
  reference_code: string;
  payment_reference: string;
  additional_notes: string;
  admin_fee: number;
}

export interface PaymentMethodOption {
  value: string;
  label: string;
}

export interface PaymentTypeOption {
  value: string;
  label: string;
}
