import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InventoryWarehouseState {
  warehouse_pkid: number;
}
const initialState: InventoryWarehouseState = {
  warehouse_pkid: 1,
};

const inventoryWarehouseSlice = createSlice({
  name: 'inventoryWarehouse',
  initialState: initialState,
  reducers: {
    setWarehousePkid: (state, action: PayloadAction<number>) => {
      state.warehouse_pkid = action.payload;
    },
  },
});

export const { setWarehousePkid } = inventoryWarehouseSlice.actions;
export default inventoryWarehouseSlice.reducer;
