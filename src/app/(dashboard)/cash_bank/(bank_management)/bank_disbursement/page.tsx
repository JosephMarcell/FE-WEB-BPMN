import { Metadata } from 'next';
import React from 'react';

import ComponentBankDisbursement from '@/components/apps/cash_bank/bank_management/bank_disbursement/component-bank-disbursement';

export const metadata: Metadata = {
  title: 'Bank Disbursement Management',
};

const BankDisbursementPage = () => {
  return <ComponentBankDisbursement />;
};

export default BankDisbursementPage;
