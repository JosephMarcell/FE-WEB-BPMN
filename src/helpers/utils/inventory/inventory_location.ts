export interface InventoryLocationProperty {
  pkid: number;
  name: string;
  location: string;
  ltd_pos: string;
  lng_pos: string;
  createdAt: string;
  updatedAt: string;
}

export const inventoryLocationInitialState: InventoryLocationProperty = {
  pkid: 0,
  name: 'Pilih Lokasi Gudang',
  location: '',
  ltd_pos: '',
  lng_pos: '',
  createdAt: '',
  updatedAt: '',
};
