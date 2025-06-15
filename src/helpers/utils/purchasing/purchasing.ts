import { SupplierProperty } from './supplier';

export interface NewPurchasingItemProperty {
  pkid?: number | null;
  code: string | null;
  name: string | null;
  price: number | null;
  total_price: number | null;
  quantity: number | null;
  unit_code: string | null;
  tax_percentage: number | null;
}

export interface NewPurchasingProperty {
  code: string | null;
  items: NewPurchasingItemProperty[];
  purchase_id?: number | null;
  supplier_id?: number | null;
  total_price: number;
}

export interface PurchaseDetailProperty {
  pkid: number | null;
  quantity: number | null;
  price: number | null;
  item: string | null;
  itemData: {
    name: string | null;
    price: number | null;
    unit: string | null;
  };
}
export interface PurchaseProperty {
  pkid?: number | null;
  code: string | null;
  requested_at: string | null;
  supplier_id: string | null;
  invoice: string | null;
  createdAt: string | null;
  PurchaseDetails: PurchaseDetailProperty[];
  Supplier: SupplierProperty;
}

export interface BudgetProperty {
  total_price: number;
}

export const newPurchasingInitialState: NewPurchasingProperty = {
  code: null,
  items: [] as NewPurchasingItemProperty[],
  purchase_id: null,
  supplier_id: null,
  total_price: 0,
};

export const purchaseInitialState: PurchaseProperty = {
  pkid: null,
  code: null,
  requested_at: null,
  supplier_id: null,
  invoice: null,
  createdAt: null,
  PurchaseDetails: [] as PurchaseDetailProperty[],
  Supplier: {} as SupplierProperty,
};
