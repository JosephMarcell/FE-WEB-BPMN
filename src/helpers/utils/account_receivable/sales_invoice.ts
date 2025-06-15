export interface SalesInvoiceProperty {
  sales_order_code: string | null;
  currency_code: string | null;
  invoice_number: string | null;
  invoice_date: Date | null;
  due_date: Date | null;
  dispatched_date: Date | null;
  taxes_included: boolean | null;
  discount_included: boolean | null;
  discounts: number | null;
  discount_amount: number | null;
  delivery_cost_included: boolean | null;
  delivery_cost: number | null;
  description: string | null;
}

export const salesInvoiceInitialState: SalesInvoiceProperty = {
  sales_order_code: null,
  currency_code: null,
  invoice_number: null,
  invoice_date: null,
  due_date: null,
  dispatched_date: null,
  taxes_included: true,
  discount_included: false,
  discounts: null,
  discount_amount: null,
  delivery_cost_included: false,
  delivery_cost: null,
  description: null,
};

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

export interface SalesDetail {
  item: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  phone_number: string;
  address: string;
  email: string;
}

export interface SalesOrder {
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
  invoice: string | null;
  createdAt: string;
  item_name: string;
  item_unit: string;
  Customer: Customer;
  SalesOrderDetails: SalesDetail[];
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

export interface SalesInvoiceDetail {
  pkid: number;
  code: string;
  sales_order_code: string;
  currency_code: string;
  invoice_number: string;
  invoice_date: Date;
  due_date: Date;
  dispatched_date: Date | null;
  sub_total: number;
  total: number;
  taxes_included: boolean;
  taxes: number;
  total_price_item_with_taxes: number;
  discount_included: boolean;
  discounts: number | null;
  discount_amount: number;
  total_price_item_with_discount: number;
  delivery_cost_included: boolean;
  delivery_cost: number | null;
  total_price_item_with_delivery_cost: number;
  description: string;
  payment_status: string;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
  salesOrder: SalesOrder;
}

export interface SalesInvoiceUpdateProperty {
  invoice_date?: Date | null;
  due_date?: Date | null;
  dispatched_date?: Date | null;
  description?: string | null;
}
