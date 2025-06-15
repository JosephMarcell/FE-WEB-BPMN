export interface PPHProperty {
  pkid: number | null;
  code: string | null;
  ter_category: string | null;
  income_min: number | null;
  income_max: number | null;
  ter_pct: number | null;
}

export const pphInitialState: PPHProperty = {
  pkid: 0,
  code: null,
  ter_category: null,
  income_min: 0,
  income_max: 0,
  ter_pct: 0,
};
