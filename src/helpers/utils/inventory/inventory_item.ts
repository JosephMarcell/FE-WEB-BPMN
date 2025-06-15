export interface TaxItemProperty {
  pkid?: number;
  name: string;
  percentage: number;
}

export interface UnitItemProperty {
  pkid?: number;
  code: string;
  name: string;
}

export interface ItemProperty {
  pkid?: number | null;
  code?: string | null;
  name: string | null;
  buy_price: number | null;
  sale_price: number | null;
  description: string | null;
  unit_id: number | null;
  category_id: number | null;
  tax_id: number | null;
  Unit: UnitItemProperty;
  Tax: TaxItemProperty;
}

export const itemInitialState: ItemProperty = {
  pkid: null,
  code: null,
  name: null,
  buy_price: null,
  sale_price: null,
  description: null,
  unit_id: 1,
  category_id: 1,
  tax_id: 1,
  Unit: {
    code: '',
    name: '',
  },
  Tax: {
    name: '',
    percentage: 0,
  },
};
