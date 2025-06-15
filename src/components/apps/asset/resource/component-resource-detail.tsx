'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ResourceDetailComponent from '@/components/apps/asset/resource/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetResourceById } from '@/app/api/hooks/fixed_asset/resource/useGetResourceByPkid';

interface IResourceDetail {
  pkid: number;
}
const ComponentResourceDetail = ({ pkid }: IResourceDetail) => {
  const pathname = usePathname();

  const { data: resourceDetail, isLoading } = useGetResourceById(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <ResourceDetailComponent data={resourceDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentResourceDetail;
