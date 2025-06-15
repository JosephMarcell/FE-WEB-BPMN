import { Metadata } from 'next';
import React from 'react';

import ComponentCashDisbursement from '@/components/apps/cash_bank/cash_management/cash_disbursement/component-cash-disbursement';

export const metadata: Metadata = {
  title: 'Cash Disbursement Management',
};

const CashDisbursementPage = () => {
  return <ComponentCashDisbursement />;
};

export default CashDisbursementPage;
