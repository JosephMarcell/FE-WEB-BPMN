export interface DetailAlocationOfProductionProperty {
  name: string;
  price: number;
  coa_pkid: number;
  percentage: number;
  machine_pkid: number;
  result_price: number;
}
export interface AlocationOfProductionProperty {
  month: string | null;
  year: number | null;
  list_production_expense: DetailAlocationOfProductionProperty[] | null;
}

export const alocationOfProductionInitialState: AlocationOfProductionProperty =
  {
    month: null,
    year: null,
    list_production_expense: null,
  };
