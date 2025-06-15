'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import IssueMaterialDetailComponent from '@/components/apps/manufacturing/production/issue_material/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetIssueMaterialByProductionOrderPkid } from '@/app/api/hooks/manufacturing/issue_material/useGetIssueMaterialByProductionOrderPkid';

interface IIssueMaterialDetail {
  pkid: number;
}

const ComponentIssueMaterialDetail = ({ pkid }: IIssueMaterialDetail) => {
  const pathname = usePathname();

  const {
    data: issueMaterialDetail,
    isLoading,
    refetch,
  } = useGetIssueMaterialByProductionOrderPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <IssueMaterialDetailComponent
            data={issueMaterialDetail}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentIssueMaterialDetail;
