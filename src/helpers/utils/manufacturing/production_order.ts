export interface ProductionOrderProperty {
  pkid?: number | null;
  quantity: number | null;
  start: Date | null;
  end: Date | null;
  status: string | null;
  item_pkid: number | null;
  production_request_pkid: number | null;
  warehouse_pkid: number | null;
}

export const productionOrderInitialState: ProductionOrderProperty = {
  pkid: null,
  quantity: null,
  start: null,
  end: null,
  status: null,
  item_pkid: null,
  production_request_pkid: null,
  warehouse_pkid: null,
};
