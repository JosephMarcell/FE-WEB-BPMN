import { Metadata } from 'next';
import React from 'react';

import ComponentWhiteColalrWitholdCertificateDetail from '@/components/apps/hrm/taxation/white_collar_withold_certificate/component-white-collar-withold-certificate-detail';

export const metadata: Metadata = {
  title: 'White Collar Withold Certificate',
};
const WhiteCollarWitholdCertificateDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentWhiteColalrWitholdCertificateDetail pkid={params.pkid} />;
};

export default WhiteCollarWitholdCertificateDetailPage;
