import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  date: string;
  debit: number | null;
  credit: number | null;
  transactionType: string;
  description: string;
  balance: number;
}

interface LedgerEntry {
  coa_name: string;
  coa_number: string;
  data: Transaction[];
  total: number;
}

interface InitialState {
  generalLedgerData: LedgerEntry[];
}

const initialStateGeneralLedger: InitialState = {
  generalLedgerData: [],
};

const generalLedgerSlice = createSlice({
  name: 'generalLedger',
  initialState: initialStateGeneralLedger,
  reducers: {
    setGeneralLedgerData: (state, action: PayloadAction<LedgerEntry[]>) => {
      state.generalLedgerData = action.payload;
    },
  },
});

export const { setGeneralLedgerData } = generalLedgerSlice.actions;
export default generalLedgerSlice.reducer;
