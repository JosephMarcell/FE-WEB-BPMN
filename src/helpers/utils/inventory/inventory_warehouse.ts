export interface InventoryWarehouse {
  pkid?: number | null;
  item_pkid: number | null;
  quantity: number | null;
  warehouse_pkid: number | null;
}

export const inventoryWarehouseInitialState: InventoryWarehouse = {
  pkid: null,
  item_pkid: null,
  quantity: null,
  warehouse_pkid: null,
};
