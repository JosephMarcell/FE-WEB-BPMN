import { Metadata } from 'next';

import ComponentsMan from '@/components/apps/manufacturing/master_data/man/component-man';

export const metadata: Metadata = {
  title: 'Man Skill',
};

const ManPage = () => {
  return <ComponentsMan />;
};

export default ManPage;
