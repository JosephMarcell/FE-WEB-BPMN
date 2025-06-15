import { Metadata } from 'next';
import React from 'react';

import ComponentMachineDetail from '@/components/apps/manufacturing/master_data/machine/component-machine-detail';

export const metadata: Metadata = {
  title: 'Machine',
};

const MachineDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentMachineDetail pkid={params.pkid} />;
};

export default MachineDetailPage;
