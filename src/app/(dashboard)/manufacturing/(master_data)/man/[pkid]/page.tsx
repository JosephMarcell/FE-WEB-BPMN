import { Metadata } from 'next';
import React from 'react';

import ComponentManSkillDetail from '@/components/apps/manufacturing/master_data/man/component-man-detail';

export const metadata: Metadata = {
  title: 'Man Skill',
};

const ManSkillDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentManSkillDetail pkid={params.pkid} />;
};

export default ManSkillDetailPage;
