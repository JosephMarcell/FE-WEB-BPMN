import billOfMaterialSlice from '@/store/inventory/bill_of_material';
import inventoryWarehouseSlice from '@/store/inventory/inventory_warehouse';
export const allInventoryReducers = {
  inventoryWarehouse: inventoryWarehouseSlice,
  billOfMaterial: billOfMaterialSlice,
};
