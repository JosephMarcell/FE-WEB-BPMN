import { Metadata } from 'next';

import ComponentsMachine from '@/components/apps/manufacturing/master_data/machine/component-machine';

export const metadata: Metadata = {
  title: 'Machine',
};

const MachinePage = () => {
  return <ComponentsMachine />;
};

export default MachinePage;
