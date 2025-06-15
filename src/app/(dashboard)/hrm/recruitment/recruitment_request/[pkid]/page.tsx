import { Metadata } from 'next';
import React from 'react';

import ComponentRecruitmentRequestDetail from '@/components/apps/hrm/recruitment/recruitment_request/component-recruitment-requst-detail';

export const metadata: Metadata = {
  title: 'Recruitment Request',
};
const RecruitmentRequestDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentRecruitmentRequestDetail pkid={params.pkid} />;
};

export default RecruitmentRequestDetailPage;
