export const priority = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];
export const orderStatus = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const deliveryStatus = [
  { value: 'Not Shipped', label: 'Not Shipped' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Returned', label: 'Returned' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export const paymentStatus = [
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Partially Paid', label: 'Partially Paid' },
  { value: 'Overdue', label: 'Overdue' },
];
export interface SalesOrderDetailProperty {
  item_pkid: number | null;
  quantity: number | null;
  description: string | null;
  currency_code: string | null;
}
export const salesOrderDetailInitialState: SalesOrderDetailProperty[] = [
  {
    item_pkid: null,
    quantity: null,
    description: null,
    currency_code: null,
  },
];
export interface SalesOrderProperty {
  pkid: number | null;
  code: string | null;
  customer_id: number | null;
  currency_code: string | null;
  order_date: Date | null;
  delivery_date?: Date | null;
  status: string | null;
  delivery_status?: string | null;
  payment_status: string | null;
  total_amount: number | null;
  description?: string | null;
  salesOrderDetails: SalesOrderDetailProperty[];
}

export const salesOrderInitialState: SalesOrderProperty = {
  pkid: null,
  code: null,
  customer_id: null,
  currency_code: null,
  order_date: null,
  delivery_date: null,
  status: null,
  delivery_status: null,
  payment_status: null,
  total_amount: null,
  description: null,
  salesOrderDetails: salesOrderDetailInitialState,
};
