import { Metadata } from 'next';
import React from 'react';

import ComponentPPH from '@/components/apps/hrm/taxation/tax_variables/pph/component-pph';

export const metadata: Metadata = {
  title: 'Ter PPh',
};

const PPHPage = () => {
  return <ComponentPPH />;
};

export default PPHPage;
