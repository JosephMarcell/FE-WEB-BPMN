import { Metadata } from 'next';
import React from 'react';

import ComponentInsurance from '@/components/apps/hrm/information_management/insurance/component-insurance';

export const metadata: Metadata = {
  title: 'Insurance',
};

const InsurancePage = () => {
  return <ComponentInsurance />;
};

export default InsurancePage;
