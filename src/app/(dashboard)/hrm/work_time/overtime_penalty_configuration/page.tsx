import { Metadata } from 'next';
import React from 'react';

import ComponentOvertimePenaltyConfiguration from '@/components/apps/hrm/work_time/overtime_penalty_configuration/component-overtime-penalty-configuration';

export const metadata: Metadata = {
  title: 'Overtime Penalty Configuration',
};

const OvertimePenaltyConfigurationPage = () => {
  return <ComponentOvertimePenaltyConfiguration />;
};

export default OvertimePenaltyConfigurationPage;
