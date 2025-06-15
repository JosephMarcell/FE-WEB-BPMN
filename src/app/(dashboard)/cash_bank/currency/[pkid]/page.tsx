import { Metadata } from 'next';
import React from 'react';

import ComponentCurrencyDetail from '@/components/apps/cash_bank/currency/component-currency-detail';

export const metadata: Metadata = {
  title: 'Currency Detail',
};

const CurrencyDetailPage = ({ params }: { params: { pkid: string } }) => {
  const pkid = parseInt(params.pkid, 10);

  if (isNaN(pkid)) {
    return <div>Invalid currency ID</div>;
  }

  return <ComponentCurrencyDetail pkid={pkid} />;
};

export default CurrencyDetailPage;
