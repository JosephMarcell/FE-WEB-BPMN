import { Metadata } from 'next';
import React from 'react';

import ComponentBankAccountDetail from '@/components/apps/cash_bank/bank_management/bank_account/component-bank-account-detail';

export const metadata: Metadata = {
  title: 'Bank Account Detail',
};

const BankAccountDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentBankAccountDetail pkid={params.pkid} />;
};

export default BankAccountDetailPage;
