import { Metadata } from 'next';

import ComponentsCoa from '@/components/apps/general_ledger/coa/component-coa';

export const metadata: Metadata = {
  title: 'Chart of Account',
};
const CoaPage = () => {
  return <ComponentsCoa />;
};

export default CoaPage;
