export interface InputOverheadManufactureProperty {
  start_date: string | null;
  end_date: string | null;
}

export const inputOverheadManufactureInitialState: InputOverheadManufactureProperty =
  {
    start_date: null,
    end_date: null,
  };

export interface OverheadManufactureProperty {
  name: string;
  price: number;
  coa_pkid: number;
  percentage: number;
  machine_pkid: number;
  result_price: number;
}
