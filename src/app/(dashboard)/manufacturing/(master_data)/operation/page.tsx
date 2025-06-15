import { Metadata } from 'next';

import ComponentsOperation from '@/components/apps/manufacturing/master_data/operation/component-operation';

export const metadata: Metadata = {
  title: 'Operation',
};

const OperationPage = () => {
  return <ComponentsOperation />;
};

export default OperationPage;
