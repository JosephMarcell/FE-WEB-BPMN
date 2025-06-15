import { Metadata } from 'next';
import React from 'react';

import ComponentBankReceiptDetail from '@/components/apps/cash_bank/bank_management/bank_receipt/component-bank-receipt-detail';

export const metadata: Metadata = {
  title: 'Bank Receipt Detail',
};

const BankReceiptDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentBankReceiptDetail pkid={params.pkid} />;
};

export default BankReceiptDetailPage;
