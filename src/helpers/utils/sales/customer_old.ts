export interface CustomerProperty {
  pkid: number | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string | null;
}

export const customerInitialState: CustomerProperty = {
  pkid: null,
  name: null,
  address: null,
  phone: null,
  email: null,
  createdAt: null,
};
