'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PositionDetail from '@/components/apps/hrm/information_management/position/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetPositionByPkid } from '@/app/api/hooks/hrm/position/useGetPositionByPkid';

interface IPositionDetail {
  pkid: number;
}
const ComponentPositionDetail = ({ pkid }: IPositionDetail) => {
  const pathname = usePathname();

  const { data: positionDetail, isLoading } = useGetPositionByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <PositionDetail data={positionDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentPositionDetail;
