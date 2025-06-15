import { Metadata } from 'next';
import React from 'react';

import ComponentWhiteCollarWitholdCertificate from '@/components/apps/hrm/taxation/white_collar_withold_certificate/component-white-collar-withold-certificate';

export const metadata: Metadata = {
  title: 'White Collar Withold Certificate',
};

const WhiteCollarWitholdCertificatePage = () => {
  return <ComponentWhiteCollarWitholdCertificate />;
};

export default WhiteCollarWitholdCertificatePage;
