import { Metadata } from 'next';
import React from 'react';

import ComponentCashDisbursementDetail from '@/components/apps/cash_bank/cash_management/cash_disbursement/component-cash-disbursement-detail';

export const metadata: Metadata = {
  title: 'Cash Disbursement Detail',
};

const CashDisbursementDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentCashDisbursementDetail pkid={params.pkid} />;
};

export default CashDisbursementDetailPage;
