import { Metadata } from 'next';
import React from 'react';

import ComponentsReductionNames from '@/components/apps/hrm/payroll/reduction_names/component-reduction_names';

export const metadata: Metadata = {
  title: 'Reduction Names',
};

const ReductionNamesPage = () => {
  return <ComponentsReductionNames />;
};

export default ReductionNamesPage;
