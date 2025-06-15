import { Metadata } from 'next';
import React from 'react';

import ComponentBpjs from '@/components/apps/hrm/payroll/bpjs/component-bpjs';

export const metadata: Metadata = {
  title: 'BPJS',
};

const BpjsPage = () => {
  return <ComponentBpjs />;
};

export default BpjsPage;
