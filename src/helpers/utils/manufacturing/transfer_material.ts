export interface TransferMaterialProperty {
  pkid: number | null;
  quantity: number | null;
  status: string | null;
  production_order_pkid: number | null;
  item_pkid: number | null;
}

export const transferMaterialInitialState: TransferMaterialProperty = {
  pkid: null,
  quantity: null,
  status: null,
  production_order_pkid: null,
  item_pkid: null,
};
