import { JournalDetailProperty } from '@/helpers/utils/general_ledger/journalDetail';

export interface JournalProperty {
  code: string | null;
  ref: string | null;
  post_date: Date | null;
  notes: string | null;
  amount: number | null;
  approval_status: boolean | null;
  post_status: boolean | null;
  accounting_period_pkid: number | null;
  numbering_pkid: number | null;
  work_centre_pkid: number | null;
  transaction_type_pkid: number | null;
  JournalDetails: JournalDetailProperty[];
}

export const journalInitialState: JournalProperty = {
  code: null,
  ref: null,
  post_date: null,
  notes: null,
  amount: null,
  approval_status: null,
  post_status: null,
  accounting_period_pkid: null,
  numbering_pkid: null,
  work_centre_pkid: null,
  transaction_type_pkid: null,
  JournalDetails: [],
};
