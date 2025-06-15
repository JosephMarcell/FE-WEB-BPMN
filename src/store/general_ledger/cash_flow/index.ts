import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InputCashFlowProperty } from '@/helpers/utils/general_ledger/cashFlowReport';

interface Activity {
  acount_type: number;
  acount_type_name: string;
  type: 'tambah' | 'kurang' | 'none';
  value: number;
}

interface CashFlowData {
  operationActivity: {
    listActivity: Activity[];
    totalOperationActivity: number;
  };
  investmentActivity: {
    listActivity: Activity[];
    totalInvestmentActivity: number;
  };
  fundingActivity: {
    listActivity: Activity[];
    totalFundingActivity: number;
  };
  dataCalculation: {
    totalCashBankThisPeriod: number;
    totalCashBankInInitialPeriod: number;
    totalCashBankInFinalPeriod: number;
  };
  periods: InputCashFlowProperty;
}

interface InitialState {
  cashFlowData: CashFlowData;
}

const initialStateCashFlow: InitialState = {
  cashFlowData: {
    operationActivity: {
      listActivity: [
        {
          acount_type: 6,
          acount_type_name: 'Akumulasi Penyusutan',
          type: 'tambah',
          value: 0,
        },
        {
          acount_type: 8,
          acount_type_name: 'Hutang Usaha',
          type: 'tambah',
          value: 0,
        },
        {
          acount_type: 9,
          acount_type_name: 'lialibitas Jangka Pendek',
          type: 'tambah',
          value: 0,
        },
        {
          acount_type: 2,
          acount_type_name: 'Piutang Usaha',
          type: 'kurang',
          value: 0,
        },
        {
          acount_type: 3,
          acount_type_name: 'Persediaan',
          type: 'kurang',
          value: 0,
        },
        {
          acount_type: 4,
          acount_type_name: 'Aset Lancar Lainnya',
          type: 'kurang',
          value: 0,
        },
        {
          acount_type: 10101010,
          acount_type_name: 'Laba / Rugi',
          type: 'none',
          value: 0,
        },
      ],
      totalOperationActivity: 0,
    },
    investmentActivity: {
      listActivity: [
        {
          acount_type: 5,
          acount_type_name: 'Aset Tetap',
          type: 'kurang',
          value: 0,
        },
        {
          acount_type: 7,
          acount_type_name: 'Aset Lainnya',
          type: 'kurang',
          value: 0,
        },
      ],
      totalInvestmentActivity: 0,
    },
    fundingActivity: {
      listActivity: [
        {
          acount_type: 10,
          acount_type_name: 'Liabilitas Jangka Panjang',
          type: 'tambah',
          value: 0,
        },
        {
          acount_type: 11,
          acount_type_name: 'Modal',
          type: 'tambah',
          value: 0,
        },
      ],
      totalFundingActivity: 0,
    },
    dataCalculation: {
      totalCashBankThisPeriod: 0,
      totalCashBankInInitialPeriod: 0,
      totalCashBankInFinalPeriod: 0,
    },
    periods: {
      start_month: null,
      start_year: null,
      end_month: null,
      end_year: null,
    },
  },
};

const cashFlowSlice = createSlice({
  name: 'cashFlow',
  initialState: initialStateCashFlow,
  reducers: {
    setCashFlowData: (state, action: PayloadAction<CashFlowData>) => {
      state.cashFlowData = action.payload;
    },
  },
});

export const { setCashFlowData } = cashFlowSlice.actions;

export default cashFlowSlice.reducer;
