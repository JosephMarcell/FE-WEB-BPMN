import { Metadata } from 'next';
import React from 'react';

import ComponentCashReceiptDetail from '@/components/apps/cash_bank/cash_management/cash_receipt/component-cash-receipt-detail';

export const metadata: Metadata = {
  title: 'Cash Receipt Detail',
};

const CashReceiptDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentCashReceiptDetail pkid={params.pkid} />;
};

export default CashReceiptDetailPage;
