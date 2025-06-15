export interface CurrencyProperty {
  code: string;
  name: string;
  symbol: string;
}

export interface Currency extends CurrencyProperty {
  pkid: number;
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

export const currencyInitialState: CurrencyProperty = {
  code: '',
  name: '',
  symbol: '',
};
