'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WorkCentreDetailComponent from '@/components/apps/manufacturing/master_data/work_centre/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetWorkCentreByPkid } from '@/app/api/hooks/manufacturing/work_centre/useGetWorkCentreByPkid';

interface IWorkCentreDetail {
  pkid: number;
}

const ComponentWorkCentreDetail = ({ pkid }: IWorkCentreDetail) => {
  const pathname = usePathname();

  const { data: WorkCentreDetail, isLoading } = useGetWorkCentreByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <WorkCentreDetailComponent data={WorkCentreDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentWorkCentreDetail;
