export interface AssetStockTakeProperty {
  title: string | null;
  stock_take_date: Date | null;
  stock_take_by: string | null;
  condition_of_assets: string | null;
  description: string | null;
  status?: string | null;
  asset_pkid: number | null;
}

export const assetStockTakeInitialState: AssetStockTakeProperty = {
  title: null,
  stock_take_date: null,
  stock_take_by: null,
  condition_of_assets: null,
  description: null,
  status: null,
  asset_pkid: 0,
};
