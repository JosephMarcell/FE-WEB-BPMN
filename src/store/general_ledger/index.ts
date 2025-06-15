import balanceSheetSlice from '@/store/general_ledger/balance_sheet/';
import cashFlowSlice from '@/store/general_ledger/cash_flow/';
import generalLedgerSlice from '@/store/general_ledger/general_ledger/';
import hppSlice from '@/store/general_ledger/hpp/';
import incomeStatementSlice from '@/store/general_ledger/income_statement/';
export const allGeneralLedgerReducers = {
  cashFlows: cashFlowSlice,
  hpp: hppSlice,
  incomeStatements: incomeStatementSlice,
  balanceSheets: balanceSheetSlice,
  generalLedger: generalLedgerSlice,
};
