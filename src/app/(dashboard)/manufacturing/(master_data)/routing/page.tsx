import { Metadata } from 'next';

import ComponentsRouting from '@/components/apps/manufacturing/master_data/routing/component-routing';

export const metadata: Metadata = {
  title: 'Routing',
};

const RoutingPage = () => {
  return <ComponentsRouting />;
};

export default RoutingPage;
