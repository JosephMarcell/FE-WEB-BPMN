export interface AssetDisposalProperty {
  title: string | null;
  disposal_reason: string | null;
  disposal_date: Date | null;
  disposal_method: string | null;
  description: string | null;
  asset_pkid: number | null;
}

export const assetDisposalInitialState: AssetDisposalProperty = {
  title: null,
  disposal_reason: null,
  disposal_date: null,
  disposal_method: null,
  description: null,
  asset_pkid: 0,
};
