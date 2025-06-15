export interface SKPTProperty {
  pkid: number | null;
  code: string | null;
  description: string | null;
  is_married: boolean | null;
  is_wife: boolean | null;
  tanggungan: number | null;
  ter_category: string | null;
  amount: number | null;
  tunjangan_tetap: number | null;
}

export const skptInitialState: SKPTProperty = {
  pkid: null,
  code: null,
  description: null,
  is_married: null,
  is_wife: null,
  tanggungan: null,
  ter_category: null,
  amount: null,
  tunjangan_tetap: null,
};
