import { Metadata } from 'next';

import ComponentsJobOrder from '@/components/apps/manufacturing/production/job_order/component-job-order';

export const metadata: Metadata = {
  title: 'Job Order',
};

const JobOrderPage = () => {
  return <ComponentsJobOrder />;
};

export default JobOrderPage;
