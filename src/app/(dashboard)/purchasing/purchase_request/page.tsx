import { Metadata } from 'next';
import React from 'react';

import ComponentsPurchasingRequest from '@/components/apps/purchasing/purchasing_request/component-purchasing-request';

export const metadata: Metadata = {
  title: 'Purchase Request',
};

const PurchasingRequestPage = () => {
  return <ComponentsPurchasingRequest />;
};

export default PurchasingRequestPage;
