import { Metadata } from 'next';
import React from 'react';

import ComponentBlueColalrWitholdCertificateDetail from '@/components/apps/hrm/taxation/blue_collar_withold_certificate/component-blue-collar-withold-certificate-detail';

export const metadata: Metadata = {
  title: 'Blue Collar Withold Certificate',
};
const BlueCollarWitholdCertificateDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentBlueColalrWitholdCertificateDetail pkid={params.pkid} />;
};

export default BlueCollarWitholdCertificateDetailPage;
