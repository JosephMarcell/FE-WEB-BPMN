'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import JobOrderDetailComponent from '@/components/apps/manufacturing/production/job_order/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAllJobOrderDetailByJobOrderPkid } from '@/app/api/hooks/manufacturing/job_order/useGetAllJobOrderDetailByJobOrderPkid';

interface IRoutingDetail {
  pkid: number;
}

const ComponentJobOrderDetail = ({ pkid }: IRoutingDetail) => {
  const pathname = usePathname();

  const { data: jobOrderDetail, isLoading } =
    useGetAllJobOrderDetailByJobOrderPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <JobOrderDetailComponent data={jobOrderDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentJobOrderDetail;
