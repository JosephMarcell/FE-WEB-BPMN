import { CustomerProperty } from '@/helpers/utils/sales/customer_old';

export interface NewSalesItemProperty {
  pkid?: number | null;
  item_code: string | null;
  name: string | null;
  price: number | null;
  total_price: number | null;
  quantity: number | null;
  unit_code: string | null;
  tax_percentage: number | null;
}

export interface NewSalesProperty {
  products: NewSalesItemProperty[];
  customer_id?: number | null;
  total_price: number;
}

export const newSalesInitialState: NewSalesProperty = {
  products: [] as NewSalesItemProperty[],
  customer_id: null,
  total_price: 0,
};

export interface SalesOrderDetailProperty {
  item: string;
  item_id: number;
  item_name: string;
  item_unit: string;
  quantity: number;
  price: number;
}

export interface SalesOrderProperty {
  pkid: number;
  code: string;
  customer_id: number;
  customer_name: string;
  total_price: number;
  total_tax: number;
  total_price_tax: number;
  payment_type: string;
  dp_percentage: number;
  dp_amount: number;
  invoice: string;
  createdAt: string;
  Customer: CustomerProperty;
  SalesOrderDetails: SalesOrderDetailProperty[];
}

export const salesOrderInitialState: SalesOrderProperty = {
  pkid: 0,
  code: '',
  customer_id: 0,
  customer_name: '',
  total_price: 0,
  total_tax: 0,
  total_price_tax: 0,
  payment_type: '',
  dp_percentage: 0,
  dp_amount: 0,
  invoice: '',
  createdAt: '',
  Customer: {
    pkid: 0,
    name: '',
    address: '',
    phone: '',
    email: '',
    createdAt: '',
  },
  SalesOrderDetails: [],
};
