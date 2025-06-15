import { BillOfMaterialObject } from '@/store/inventory/bill_of_material';

import { ItemProperty } from './item/item';

export const BomStatus = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'obsolete', label: 'Obsolete' },
];

export interface BillOfMaterialProperty {
  code: string | null;
  item_header_pkid: number | null;
  production_quantity: number | null;
  total_cost?: number | null;
  description?: string | null;
  status: string | null;
  effective_date?: Date | null;
  expiration_date?: Date | null;
  bomDetails?: BillOfMaterialObject[];
  itemHeader?: ItemProperty;
}

export const initialStateBillOfMaterial: BillOfMaterialProperty = {
  code: null,
  item_header_pkid: null,
  production_quantity: null,
  total_cost: null,
  description: null,
  status: null,
  effective_date: null,
  expiration_date: null,
  bomDetails: [],
};
export const generateUniqueFourDigitNumber = (): number => {
  const now = new Date();

  const milliseconds = now.getMilliseconds() % 100;

  const seconds = now.getSeconds() % 10;

  const uniqueNumber = milliseconds * 10 + seconds;

  return uniqueNumber % 10000;
};
