import { Metadata } from 'next';
import React from 'react';

import ComponentPresenceWhite from '@/components/apps/hrm/work_time/presence_white/component-presence-white';

export const metadata: Metadata = {
  title: 'Presence White',
};

const PresenceWhitePage = () => {
  return <ComponentPresenceWhite />;
};

export default PresenceWhitePage;
