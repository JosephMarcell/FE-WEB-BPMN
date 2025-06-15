import { Metadata } from 'next';
import React from 'react';

import ComponentBankDisbursementDetail from '@/components/apps/cash_bank/bank_management/bank_disbursement/component-bank-disbursement-detail';

export const metadata: Metadata = {
  title: 'Bank Disbursement Detail',
};

const BankDisbursementDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentBankDisbursementDetail pkid={params.pkid} />;
};

export default BankDisbursementDetailPage;
