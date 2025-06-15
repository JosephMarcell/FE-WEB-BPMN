import { Metadata } from 'next';

import ComponentsInspectionProduct from '@/components/apps/manufacturing/production/inspection_product/component-inspection-product';

export const metadata: Metadata = {
  title: 'Inspection Product',
};

const InspectionProductPage = () => {
  return <ComponentsInspectionProduct />;
};

export default InspectionProductPage;
