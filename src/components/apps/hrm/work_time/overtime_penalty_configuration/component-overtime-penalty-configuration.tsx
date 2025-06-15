'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import OvertimePenaltyConfigurationForm from '@/components/apps/hrm/work_time/overtime_penalty_configuration/_components/overtime-penalty-configuration-form';

const ComponentsOvertimePenaltyConfig = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div>
        <div>
          <OvertimePenaltyConfigurationForm />
        </div>
      </div>
    </div>
  );
};

export default ComponentsOvertimePenaltyConfig;
