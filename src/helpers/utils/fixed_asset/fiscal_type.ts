export interface FiscalTypeProperty {
  name: string | null;
  estimated_life: number | null;
  depreciation_method: string | null;
}

export const fiscalTypeInitialState: FiscalTypeProperty = {
  name: null,
  estimated_life: 0,
  depreciation_method: null,
};
