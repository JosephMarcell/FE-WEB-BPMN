export interface WarehouseProperty {
  pkid?: number;
  name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  contact_number: string | null;
}

export const WarehouseInitialState: WarehouseProperty = {
  name: null,
  address: null,
  city: null,
  state: null,
  country: 'Indonesia', // Default to Indonesia
  postal_code: null,
  contact_number: null,
};
