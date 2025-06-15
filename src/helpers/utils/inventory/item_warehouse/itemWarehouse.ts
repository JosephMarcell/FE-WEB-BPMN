export interface ItemWarehouseProperty {
  pkid?: number;
  item_pkid: number | null;
  warehouse_pkid: number | null;
  quantity: number | null;
  reorder_level: number | null;
  reorder_quantity: number | null;
  last_restocked: string | null; // Assuming date is in string format (ISO 8601)
  expiry_date: string | null; // Assuming date is in string format (ISO 8601)
}

export const ItemWarehouseInitialState: ItemWarehouseProperty = {
  item_pkid: null,
  warehouse_pkid: null,
  quantity: null,
  reorder_level: null,
  reorder_quantity: null,
  last_restocked: null,
  expiry_date: null,
};
