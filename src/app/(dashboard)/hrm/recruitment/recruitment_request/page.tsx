import { Metadata } from 'next';
import React from 'react';

import ComponentRecruitmentRequest from '@/components/apps/hrm/recruitment/recruitment_request/component-recruitment-request';

export const metadata: Metadata = {
  title: 'Recruitment Request',
};

const RecruitmentRequestPage = () => {
  return <ComponentRecruitmentRequest />;
};

export default RecruitmentRequestPage;
