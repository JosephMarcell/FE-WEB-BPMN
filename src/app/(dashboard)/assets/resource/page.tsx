import { Metadata } from 'next';
import React from 'react';

import ComponentsResource from '@/components/apps/asset/resource/component-resource';

export const metadata: Metadata = {
  title: 'Resource',
};

const ResourcePage = () => {
  return <ComponentsResource />;
};

export default ResourcePage;
