import { Metadata } from 'next';
import React from 'react';

import ComponentSKPT from '@/components/apps/hrm/taxation/tax_variables/skpt/component-skpt';

export const metadata: Metadata = {
  title: 'Status Keluarga, PTKP & Tunjangan',
};

const SKPTPage = () => {
  return <ComponentSKPT />;
};

export default SKPTPage;
