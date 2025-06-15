import { Metadata } from 'next';

import ComponentsProductionRequest from '@/components/apps/manufacturing/production/production_request/component-production-request';

export const metadata: Metadata = {
  title: 'Production Request',
};

const ProductionRequestPage = () => {
  return <ComponentsProductionRequest />;
};

export default ProductionRequestPage;
