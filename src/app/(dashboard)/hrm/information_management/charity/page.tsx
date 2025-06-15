import { Metadata } from 'next';
import React from 'react';

import ComponentCharity from '@/components/apps/hrm/information_management/charity/component-charity';

export const metadata: Metadata = {
  title: 'Charity',
};

const CharityPage = () => {
  return <ComponentCharity />;
};

export default CharityPage;
