import { Metadata } from 'next';

import ComponentsWorkCentre from '@/components/apps/manufacturing/master_data/work_centre/component-work-centre';

export const metadata: Metadata = {
  title: 'Work Centre',
};

const WorkCentrePage = () => {
  return <ComponentsWorkCentre />;
};

export default WorkCentrePage;
