import { Metadata } from 'next';
import React from 'react';

import ComponentPKP from '@/components/apps/hrm/taxation/tax_variables/pkp/component-pkp';

export const metadata: Metadata = {
  title: 'PKP',
};

const PKPPage = () => {
  return <ComponentPKP />;
};

export default PKPPage;
