import { Metadata } from 'next';
import React from 'react';

import ComponentCashReceipt from '@/components/apps/cash_bank/cash_management/cash_receipt/component-cash-receipt';

export const metadata: Metadata = {
  title: 'Cash Receipt Management',
};

const CashReceiptPage = () => {
  return <ComponentCashReceipt />;
};

export default CashReceiptPage;
