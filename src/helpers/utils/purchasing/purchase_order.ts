export const priority = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];
export const orderStatus = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Ordered', label: 'Ordered' },
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
export interface PurchaseOrderDetailProperty {
  item_pkid: number | null;
  quantity: number | null;
  description: string | null;
  currency_code: string | null;
}
export interface PurchaseOrderProperty {
  pkid: number | null;
  code: string | null;
  purchase_request_id?: number | null;
  supplier_id: number | null;
  currency_code?: string | null;
  requested_date: Date | null;
  order_date?: Date | null;
  delivery_date?: Date | null;
  status: string | null;
  delivery_status: string | null;
  payment_status: string | null;
  total_amount: number | null;
  description?: string | null;
  purchaseOrderDetails: PurchaseOrderDetailProperty[];
}
export const purchaseOrderDetailInitialState: PurchaseOrderDetailProperty[] = [
  {
    item_pkid: null,
    quantity: null,
    description: null,
    currency_code: null,
  },
];
export const purchaseOrderInitialState: PurchaseOrderProperty = {
  pkid: null,
  code: null,
  purchase_request_id: null,
  supplier_id: null,
  currency_code: null,
  requested_date: null,
  order_date: null,
  delivery_date: null,
  status: null,
  delivery_status: null,
  payment_status: null,
  total_amount: null,
  description: null,
  purchaseOrderDetails: purchaseOrderDetailInitialState,
};
