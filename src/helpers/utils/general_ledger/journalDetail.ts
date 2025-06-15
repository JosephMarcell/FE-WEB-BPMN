import { CoaProperty } from '@/helpers/utils/general_ledger/coa';

export interface JournalDetailProperty {
  credit: number;
  credit_curr: number;
  debit: number;
  debit_curr: number;
  coa_pkid: number;
  name: string;
  number: string;
  Coa?: CoaProperty;
  pkid?: number;
}
