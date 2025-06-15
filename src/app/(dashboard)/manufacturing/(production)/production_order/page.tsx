import { Metadata } from 'next';

import ComponentsProductionOrder from '@/components/apps/manufacturing/production/production_order/component-production-order';

export const metadata: Metadata = {
  title: 'Production Order',
};

const ProductionOrderPage = () => {
  return <ComponentsProductionOrder />;
};

export default ProductionOrderPage;
