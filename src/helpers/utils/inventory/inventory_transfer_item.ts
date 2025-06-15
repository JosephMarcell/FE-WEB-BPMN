export const transferType = [
  { value: 'production', label: 'Production' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'sales', label: 'Sales (Return)' },
];
export const transferStatus = [
  { value: 'on_going', label: 'On Going' },
  { value: 'success', label: 'Success' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];
export interface InventoryTransferItemDetailProperty {
  pkid: number | null;
  transfer_pkid: number | null;
  item_pkid: number | null;
  item_quantity: number | null;
  item_accepted_quantity?: number | null;
  item_rejected_quantity?: number | null;
  expiry_date?: Date | null;
  notes?: string | null;
}
export interface InventoryTransferItemProperty {
  pkid: number | null;
  code: string | null;
  from_warehouse_pkid?: number | null;
  to_warehouse_pkid?: number | null;
  supplier_pkid?: number | null;
  customer_pkid?: number | null;
  transfer_date: Date | null;
  status: string | null;
  type: string | null;
  total_quantity?: number | null;
  total_accepted_quantity?: number | null;
  total_rejected_quantity?: number | null;
  reference_number?: string | null;
  description?: string | null;
  is_rejected?: boolean | null;
  transferDetails: InventoryTransferItemDetailProperty[];
}

export const inventoryTransferItemDetailInitialState: InventoryTransferItemDetailProperty[] =
  [];
export const inventoryTransferItemInitialState: InventoryTransferItemProperty =
  {
    pkid: null,
    code: null,
    from_warehouse_pkid: null,
    to_warehouse_pkid: null,
    supplier_pkid: null,
    customer_pkid: null,
    transfer_date: null,
    status: null,
    type: null,
    total_quantity: null,
    is_rejected: false,
    total_accepted_quantity: null,
    total_rejected_quantity: null,
    description: null,
    transferDetails: inventoryTransferItemDetailInitialState,
  };
