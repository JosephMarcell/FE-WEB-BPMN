import { Metadata } from 'next';
import React from 'react';

import ComponentCashAccountDetail from '@/components/apps/cash_bank/cash_management/cash_account/component-cash-account-detail';

export const metadata: Metadata = {
  title: 'Cash Account Detail',
};

const CashAccountDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentCashAccountDetail pkid={params.pkid} />;
};

export default CashAccountDetailPage;
