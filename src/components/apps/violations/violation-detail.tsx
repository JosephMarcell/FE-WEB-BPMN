'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import DetailViolation from '@/components/apps/violations/components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetViolationById } from '@/app/api/hooks/violations/useGetViolationById';

interface IViolationDetail {
  pkid: number;
}
const ViolationDetail = ({ pkid }: IViolationDetail) => {
  const pathname = usePathname();

  const { data: ViolationDetail, isLoading } = useGetViolationById(pkid);
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <DetailViolation
            data={ViolationDetail.violation}
            media={ViolationDetail.violation_media}
          />
        )}
      </div>
    </div>
  );
};

export default ViolationDetail;
