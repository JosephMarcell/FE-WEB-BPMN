import { Metadata } from 'next';
import React from 'react';

import ComponentAutomation from '@/components/apps/hrm/others/automation/component-automation';

export const metadata: Metadata = {
  title: 'Automation',
};

const AutomationPage = () => {
  return <ComponentAutomation />;
};

export default AutomationPage;
