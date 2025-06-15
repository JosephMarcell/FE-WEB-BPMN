import { Metadata } from 'next';
import React from 'react';

import ComponentBankAccount from '@/components/apps/cash_bank/bank_management/bank_account/component-bank-account';

export const metadata: Metadata = {
  title: 'Bank Account Management',
};

const BankAccountPage = () => {
  return <ComponentBankAccount />;
};

export default BankAccountPage;
