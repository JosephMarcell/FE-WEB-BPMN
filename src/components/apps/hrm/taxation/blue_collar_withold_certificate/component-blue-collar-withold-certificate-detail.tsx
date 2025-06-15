'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BlueCollarWitholdCertificate from '@/components/apps/hrm/taxation/blue_collar_withold_certificate/_components/blue-collar-withold-certificate';

interface IBlueCollarWitholdCertificateDetail {
  pkid: number;
}

const ComponentBlueCollarWitholdCertificateDetail = ({
  pkid,
}: IBlueCollarWitholdCertificateDetail) => {
  const pathname = usePathname();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        <BlueCollarWitholdCertificate pkid={pkid} />
      </div>
    </div>
  );
};

export default ComponentBlueCollarWitholdCertificateDetail;
