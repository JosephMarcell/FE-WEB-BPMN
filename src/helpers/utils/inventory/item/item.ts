import { UnitProperty } from '@/helpers/utils/inventory/master_data/unit/unit';
import { WarehouseProperty } from '@/helpers/utils/inventory/master_data/warehouse/warehouse';

export interface ItemProperty {
  pkid?: number;
  item_category_pkid: number | null;
  unit_pkid: number | null;
  tax_pkid: number | null;
  currency_code: string | null;
  name: string | null;
  purchase_price: number | null;
  selling_price: number | null;
  description: string | null;
  sku: string | null;
  // status: boolean | null;
  barcode: string | null;
  weight: number | null;
  dimensions: string | null; // dimensions should be a string
  code?: string;
  unit?: UnitProperty;
  warehouse?: WarehouseProperty;
}

export const ItemInitialState: ItemProperty = {
  item_category_pkid: null,
  unit_pkid: null,
  tax_pkid: null,
  currency_code: null,
  name: null,
  purchase_price: null,
  selling_price: null,
  description: null,
  sku: null,
  // status: null,
  barcode: null,
  weight: null,
  dimensions: null,
};

export interface Currency {
  pkid: number;
  code: string;
  name: string;
  symbol: string;
}

export interface Tax {
  pkid: number;
  code: string;
  type: string;
  name: string;
  rate: number;
  description: string;
  effective_date: string;
  jurisdiction: string;
  calculation_method: string;
  is_active: boolean;
}

export interface ItemCategory {
  pkid: number;
  code: string;
  coa_pkid: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ItemDetail extends ItemProperty {
  currency: Currency | null;
  tax: Tax | null;
  item_category: ItemCategory | null;
  created_by: string | null;
  created_date: string | null;
  created_host: string | null;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  tenant_id: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}
