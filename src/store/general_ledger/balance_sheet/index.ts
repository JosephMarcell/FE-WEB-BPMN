import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InputBalanceSheetReport } from '@/helpers/utils/general_ledger/balanceSheetReport';

interface AssetCategory {
  total: number;
}

interface BalanceSheetData {
  cashAndBanks: AssetCategory[];
  businessLoans: AssetCategory[];
  supplies: AssetCategory[];
  otherCurrentAssets: AssetCategory[];
  AccumulatedDepreciation: AssetCategory[];
  historicalValues: AssetCategory[];
  otherAssets: AssetCategory[];
  businessDebts: AssetCategory[];
  shortTermLiabilities: AssetCategory[];
  longTermLiabilities: AssetCategory[];
  modals: AssetCategory[];
  totalCurrentAssets: number;
  totalFixedAssets: number;
  totalAssets: number;
  totalShortTermLiabilities: number;
  totalLiabilities: number;
  totalEquity: number;
  totalEquityAndLiability: number;
  totalNonCurrentAssets: number;
  periods: InputBalanceSheetReport;
}

interface InitialState {
  balanceSheetData: BalanceSheetData;
}

const initialStateBalanceSheet: InitialState = {
  balanceSheetData: {
    cashAndBanks: [{ total: 0 }],
    businessLoans: [{ total: 0 }],
    supplies: [{ total: 0 }],
    otherCurrentAssets: [{ total: 0 }],
    AccumulatedDepreciation: [{ total: 0 }],
    historicalValues: [{ total: 0 }],
    otherAssets: [{ total: 0 }],
    businessDebts: [{ total: 0 }],
    shortTermLiabilities: [{ total: 0 }],
    longTermLiabilities: [{ total: 0 }],
    modals: [{ total: 0 }],
    totalCurrentAssets: 0,
    totalFixedAssets: 0,
    totalAssets: 0,
    totalShortTermLiabilities: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalEquityAndLiability: 0,
    totalNonCurrentAssets: 0,
    periods: {
      end_date: null,
    },
  },
};

const balanceSheetSlice = createSlice({
  name: 'balanceSheet',
  initialState: initialStateBalanceSheet,
  reducers: {
    setBalanceSheetData: (state, action: PayloadAction<BalanceSheetData>) => {
      state.balanceSheetData = action.payload;
    },
  },
});

export const { setBalanceSheetData } = balanceSheetSlice.actions;

export default balanceSheetSlice.reducer;
