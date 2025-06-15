import { Metadata } from 'next';
import React from 'react';

import ComponentsCurrency from '@/components/apps/cash_bank/currency/component-currency';

export const metadata: Metadata = {
  title: 'Currency Management',
};

const CurrencyPage = () => {
  return <ComponentsCurrency />;
};

export default CurrencyPage;
