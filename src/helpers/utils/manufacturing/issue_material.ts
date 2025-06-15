export interface IssueMaterialProperty {
  pkid: number | null;
  quantity: number | null;
  approval: string | null;
  production_order_pkid: number | null;
  item_pkid: number | null;
}

export const issueMaterialInitialState: IssueMaterialProperty = {
  pkid: null,
  quantity: null,
  approval: null,
  production_order_pkid: null,
  item_pkid: null,
};
