import { Metadata } from 'next';
import React from 'react';

import ComponentHolidaySchedule from '@/components/apps/hrm/work_time/holiday_schedule/component-holiday-schedule';

export const metadata: Metadata = {
  title: 'Holiday Schedule',
};

const HolidaySchedulePage = () => {
  return <ComponentHolidaySchedule />;
};

export default HolidaySchedulePage;
