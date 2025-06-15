'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WhiteCollarWitholdCertificate from '@/components/apps/hrm/taxation/white_collar_withold_certificate/_components/white_collar_withold_certificate';

interface IWhiteCollarWitholdCertificateDetail {
  pkid: number;
}

const ComponentWhiteCollarWitholdCertificateDetail = ({
  pkid,
}: IWhiteCollarWitholdCertificateDetail) => {
  const pathname = usePathname();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        <WhiteCollarWitholdCertificate pkid={pkid} />
      </div>
    </div>
  );
};

export default ComponentWhiteCollarWitholdCertificateDetail;
