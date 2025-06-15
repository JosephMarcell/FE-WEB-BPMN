import { Metadata } from 'next';

import ComponentsRequestMan from '@/components/apps/manufacturing/production/request_man/component-request-man';

export const metadata: Metadata = {
  title: 'Request Man',
};

const RequestManPage = () => {
  return <ComponentsRequestMan />;
};

export default RequestManPage;
