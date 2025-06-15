'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import RoutingDetailComponent from '@/components/apps/manufacturing/master_data/routing/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAllRoutingByItemPkid } from '@/app/api/hooks/manufacturing/routing/useGetAllRoutingByItemPkid';

interface IRoutingDetail {
  pkid: number;
}

const ComponentRoutingDetail = ({ pkid }: IRoutingDetail) => {
  const pathname = usePathname();

  const { data: routingDetail, isLoading } = useGetAllRoutingByItemPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <RoutingDetailComponent data={routingDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentRoutingDetail;
