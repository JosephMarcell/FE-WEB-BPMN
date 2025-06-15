export interface ProductionRequestProperty {
  // pkid: number | null;
  start: Date | null;
  end: Date | null;
  quantity: number | null;
  status: string | null;
  item_pkid: number | null;
  sales_order_pkid?: number | null;
  warehouse_pkid?: number | null;
}

export const productionRequestInitialState: ProductionRequestProperty = {
  // pkid: null,
  start: null,
  end: null,
  quantity: null,
  status: null,
  item_pkid: null,
  sales_order_pkid: null,
  warehouse_pkid: null,
};
