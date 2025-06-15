import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InputIncomeStatementProperty } from '@/helpers/utils/general_ledger/incomeStatementReport';

interface OperationalExpenseItem {
  name: string;
  value: number;
}

interface IncomeStatementData {
  pendapatan: number;
  totalBebanPokokPenjualan: number;
  labaKotor: number;
  pendapatanOperasional: number;
  totalBebanOperasional: number;
  listBebanOperational: OperationalExpenseItem[];
  pendapatanNonOperasional: number;
  bebanNonOperasional: number;
  totalPendapatanNonOperasionaldanBebanNonOperasional: number;
  labaBersih: number;
  periods: InputIncomeStatementProperty;
}

interface InitialState {
  incomeStatementData: IncomeStatementData;
}

const initialStateIncomeStatement: InitialState = {
  incomeStatementData: {
    pendapatan: 0,
    totalBebanPokokPenjualan: 0,
    labaKotor: 0,
    pendapatanOperasional: 0,
    totalBebanOperasional: 0,
    listBebanOperational: [],
    pendapatanNonOperasional: 0,
    bebanNonOperasional: 0,
    totalPendapatanNonOperasionaldanBebanNonOperasional: 0,
    labaBersih: 0,
    periods: {
      start_date: null,
      end_date: null,
    },
  },
};

const incomeStatementSlice = createSlice({
  name: 'incomeStatement',
  initialState: initialStateIncomeStatement,
  reducers: {
    setIncomeStatementData: (
      state,
      action: PayloadAction<IncomeStatementData>,
    ) => {
      state.incomeStatementData = action.payload;
    },
  },
});

export const { setIncomeStatementData } = incomeStatementSlice.actions;
export default incomeStatementSlice.reducer;
