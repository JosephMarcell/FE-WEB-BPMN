export interface AssetRevaluationProperty {
  title: string | null;
  revaluation_amount: number | null;
  revaluation_date: Date | null;
  revaluation_year: number | null;
  description: string | null;
  asset_pkid: number | null;
}

export const assetRevaluationInitialState: AssetRevaluationProperty = {
  title: null,
  revaluation_amount: 0,
  revaluation_date: null,
  revaluation_year: 0,
  description: null,
  asset_pkid: 0,
};
