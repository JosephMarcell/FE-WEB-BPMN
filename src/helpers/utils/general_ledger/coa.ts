export interface CoaProperty {
  name: string | null;
  number: string | null;
  normal_balance: string | null;
  opening_balance: string | null;
  entity: string | null;
  description: string | null;
  transaction_type_pkid: number | null;
  currency_pkid: string | null;
  work_centre_pkid: number | null;
  coa_group_pkid: number | null;
  account_type_pkid: number | null;
  per_tanggal: Date | null;
  sub_account: number | null;
}

export const coaInitialState: CoaProperty = {
  name: null,
  number: null,
  normal_balance: 'K',
  opening_balance: null,
  entity: 'SBY',
  description: null,
  transaction_type_pkid: 1,
  currency_pkid: '1',
  work_centre_pkid: 1,
  coa_group_pkid: null,
  account_type_pkid: null,
  per_tanggal: null,
  sub_account: null,
};

export interface CoaPropertyWithPkid extends CoaProperty {
  pkid: string;
}

export interface GetCoaByCoaGroupInput {
  coaGroupIds: number[];
}

export interface GetCoaByCoaGroupResponse {
  data: CoaPropertyWithPkid[];
  message: string;
  isSuccess: boolean;
  status: number;
}
