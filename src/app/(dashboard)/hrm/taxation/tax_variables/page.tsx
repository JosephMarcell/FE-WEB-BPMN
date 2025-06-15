import { Metadata } from 'next';
import React from 'react';

import ComponentTaxVariables from '@/components/apps/hrm/taxation/tax_variables/component-tax-variables';

export const metadata: Metadata = {
  title: 'Tax Variables',
};

const TaxVariablesPage = () => {
  return <ComponentTaxVariables />;
};

export default TaxVariablesPage;
