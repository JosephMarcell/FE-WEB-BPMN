import { Metadata } from 'next';

import ComponentsAlocationOfProduction from '@/components/apps/general_ledger/alocation_of_production/component-alocation-of-production';

export const metadata: Metadata = {
  title: 'End Of Month',
};
const AlocationOfProductionPage = () => {
  return <ComponentsAlocationOfProduction />;
};

export default AlocationOfProductionPage;
