import { Metadata } from 'next';

import ComponentsReceiveProduct from '@/components/apps/manufacturing/production/receive_product/component-receive-product';

export const metadata: Metadata = {
  title: 'Receive Product',
};

const ReceiveProductPage = () => {
  return <ComponentsReceiveProduct />;
};

export default ReceiveProductPage;
