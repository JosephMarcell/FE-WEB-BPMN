export const receiveType = [
  { value: 'production', label: 'Production' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'sales', label: 'Sales (Return)' },
];

export const receiveStatus = [
  { value: 'on_going', label: 'On Going' },
  { value: 'success', label: 'Success' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export interface InventoryReceiveItemDetailProperty {
  pkid?: number | null;
  receive_pkid: number | null;
  item_pkid: number | null;
  item_quantity: number | null;
  item_accepted_quantity?: number | null;
  item_rejected_quantity?: number | null;
  expiry_date?: Date | null;
  notes?: string | null;
}
export interface InventoryReceiveItemProperty {
  pkid?: number | null;
  code: string | null;
  warehouse_pkid?: string | null;
  supplier_pkid?: number | null;
  customer_pkid?: number | null;
  reference_number?: string | null;
  received_date: Date | null;
  status: string | null;
  type: string | null;
  total_quantity?: number | null;
  total_accepted_quantity?: number | null;
  total_rejected_quantity?: number | null;
  is_rejected: boolean | null;
  description?: null;
  receiveDetails: InventoryReceiveItemDetailProperty[];
}

export const inventoryReceiveItemDetailInitialState: InventoryReceiveItemDetailProperty[] =
  [];
export const inventoryReceiveItemInitialState: InventoryReceiveItemProperty = {
  pkid: null,
  code: null,
  warehouse_pkid: null,
  supplier_pkid: null,
  customer_pkid: null,
  reference_number: null,
  received_date: null,
  status: null,
  type: null,
  total_quantity: null,
  total_accepted_quantity: null,
  total_rejected_quantity: null,
  is_rejected: false,
  description: null,
  receiveDetails: inventoryReceiveItemDetailInitialState,
};
