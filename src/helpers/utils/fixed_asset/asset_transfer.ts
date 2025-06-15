export interface AssetTransferProperty {
  title: string | null;
  new_address: string | null;
  new_department: string | null;
  transfer_method: string | null;
  transfer_date: Date | null;
  transfer_cost: number | null;
  quantity: number | null;
  description: string | null;
  asset_pkid: number | null;
}

export const assetTransferInitialState: AssetTransferProperty = {
  title: null,
  new_address: null,
  new_department: null,
  transfer_method: null,
  transfer_date: null,
  transfer_cost: 0,
  quantity: 0,
  description: null,
  asset_pkid: 0,
};
