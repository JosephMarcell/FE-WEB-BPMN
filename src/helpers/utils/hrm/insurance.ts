export interface InsuranceProperty {
  name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  asuransi_type: string | null;
  asuransi_amount: number | null | string;
}

export const insuranceInitialState: InsuranceProperty = {
  name: null,
  email: null,
  address: null,
  phone: null,
  asuransi_type: null,
  asuransi_amount: null,
};
