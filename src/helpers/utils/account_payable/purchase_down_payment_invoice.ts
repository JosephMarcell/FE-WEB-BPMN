export interface PurchaseDownPaymentInvoiceProperty {
  purchase_order_code: string | null;
  currency_code: string | null;
  invoice_number: string | null;
  invoice_date: Date | null;
  due_date: Date | null;
  received_date: Date | null;
  taxes_included: boolean | null;
  discount_included: boolean | null;
  discounts: number | null;
  discount_amount: number | null;
  delivery_cost_included: boolean | null;
  delivery_cost: number | null;
  dp_percent: number | null;
  dp_paid_amount: number | null;
  dp_method: 'percent' | 'cash' | null;
  description: string | null;
}

export const purchaseDownPaymentInvoiceInitialState: PurchaseDownPaymentInvoiceProperty =
  {
    purchase_order_code: null,
    currency_code: null,
    invoice_number: null,
    invoice_date: null,
    due_date: null,
    received_date: null,
    taxes_included: true,
    discount_included: false,
    discounts: null,
    discount_amount: null,
    delivery_cost_included: false,
    delivery_cost: null,
    dp_percent: null,
    dp_paid_amount: null,
    dp_method: null,
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

export interface PurchaseDetail {
  pkid: number;
  quantity: number;
  price: number;
  item: string;
  itemData: {
    name: string;
    price: number;
    unit: string;
  };
}

export interface Supplier {
  name: string;
  phone_number: string;
  address: string;
  npwp: string;
}

export interface PurchaseOrder {
  pkid: number;
  code: string;
  requested_at: string;
  supplier_id: number;
  invoice: string;
  createdAt: string;
  updatedAt: string;
  PurchaseDetails: PurchaseDetail[];
  Supplier: Supplier;
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

export interface DpMethodOption {
  value: 'percent' | 'cash';
  label: 'Percent' | 'Cash';
}

export interface PurchaseDownPaymentInvoiceDetail {
  pkid: number;
  code: string;
  purchase_order_code: string;
  currency_code: string;
  invoice_number: string;
  invoice_date: Date;
  due_date: Date;
  received_date: Date | null;
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
  dp_percent: number;
  dp_paid_amount: number;
  dp_method: 'percent' | 'cash';
  dp_stage: string;
  remaining_payments: number;
  paid: number;
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
  purchaseOrder: PurchaseOrder;
}

export interface PurchaseDownPaymentInvoiceUpdateProperty {
  invoice_date?: Date | null;
  due_date?: Date | null;
  received_date?: Date | null;
  description?: string | null;
}
