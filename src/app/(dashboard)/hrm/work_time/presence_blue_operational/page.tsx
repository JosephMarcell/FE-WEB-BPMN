import { Metadata } from 'next';
import React from 'react';

import ComponentPresenceBlue from '@/components/apps/hrm/work_time/presence_blue_operational/component-presence-blue-operational';

export const metadata: Metadata = {
  title: 'Presence Blue',
};

const PresenceBluePage = () => {
  return <ComponentPresenceBlue />;
};

export default PresenceBluePage;
