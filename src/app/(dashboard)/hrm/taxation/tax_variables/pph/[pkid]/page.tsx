import { Metadata } from 'next';
import React from 'react';

import ComponentPPHDetail from '@/components/apps/hrm/taxation/tax_variables/pph/component-pph-detail';

export const metadata: Metadata = {
  title: 'PPH',
};
const PPHDetailPage = ({ params }: { params: { _: number } }) => {
  return <ComponentPPHDetail {...params} />;
};

export default PPHDetailPage;
