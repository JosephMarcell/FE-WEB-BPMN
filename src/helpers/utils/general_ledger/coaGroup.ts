export interface CoaGroupProperty {
  name: string | null;
  calc: string | null;
  code: string | null;
  description: string | null;
  account_type_pkid: number | null;
}
export const CoaGroupInitialState: CoaGroupProperty = {
  name: null,
  calc: null,
  code: null,
  description: null,
  account_type_pkid: null,
};
