import { Metadata } from 'next';
import React from 'react';

import ComponentBankReceipt from '@/components/apps/cash_bank/bank_management/bank_receipt/component-bank-receipt';

export const metadata: Metadata = {
  title: 'Bank Receipt Management',
};

const BankReceiptPage = () => {
  return <ComponentBankReceipt />;
};

export default BankReceiptPage;
