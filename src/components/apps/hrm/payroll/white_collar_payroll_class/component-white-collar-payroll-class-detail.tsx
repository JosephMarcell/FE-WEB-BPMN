'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WhiteCollarPayrollClassDetail from '@/components/apps/hrm/payroll/white_collar_payroll_class/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetWhiteCollarPayrollClassByPkid } from '@/app/api/hooks/hrm/white_collar_payroll_class/useGetWhiteCollarPayrollClassByPkid';

interface IWhiteCollarPayrollClassDetail {
  pkid: number;
}

const ComponentWhiteCollarPayrollClassDetail = ({
  pkid,
}: IWhiteCollarPayrollClassDetail) => {
  const pathname = usePathname();

  const { data: whiteCollarPayrollClassDetail, isLoading } =
    useGetWhiteCollarPayrollClassByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <WhiteCollarPayrollClassDetail data={whiteCollarPayrollClassDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentWhiteCollarPayrollClassDetail;
