import { Metadata } from 'next';
import React from 'react';

import ComponentCashAccount from '@/components/apps/cash_bank/cash_management/cash_account/component-cash-account';

export const metadata: Metadata = {
  title: 'Cash Account Management',
};

const CashAccountPage = () => {
  return <ComponentCashAccount />;
};

export default CashAccountPage;
