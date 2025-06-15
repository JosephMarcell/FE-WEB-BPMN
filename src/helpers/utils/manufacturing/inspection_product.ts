export interface InspectionProductProperty {
  entry_date: Date | null;
  quantity: number | null;
  result: string | null;
  quantity_reject: number | null;
  status: string | null;
  quantity_used: number | null;
  receive_product_pkid: number | null;
  production_order_pkid: number | null;
  item_pkid: number | null;
  warehouse_pkid?: number | null;
}

export const inspectionProductInitialState: InspectionProductProperty = {
  entry_date: null,
  quantity: null,
  result: null,
  quantity_reject: null,
  status: null,
  quantity_used: null,
  receive_product_pkid: null,
  production_order_pkid: null,
  item_pkid: null,
  warehouse_pkid: null,
};

export interface ItemRejectionProperty {
  item_pkid: number | null;
  quantity: number | null;
}

export const itemRejectionInitialState: ItemRejectionProperty[] = [];
