export interface CharityProperty {
  name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  amal_type: string | null;
  amal_amount: string | number | null;
}

export const charityInitialState: CharityProperty = {
  name: null,
  email: null,
  address: null,
  phone: null,
  amal_type: null,
  amal_amount: null,
};
