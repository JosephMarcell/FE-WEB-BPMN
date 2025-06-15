'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import FacilityDetailComponent from '@/components/apps/asset/facility/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetFacilityById } from '@/app/api/hooks/fixed_asset/facility/useGetFacilityByPkid';

interface IFacilityDetail {
  pkid: number;
}
const ComponentFacilityDetail = ({ pkid }: IFacilityDetail) => {
  const pathname = usePathname();

  const { data: FacilityDetail, isLoading } = useGetFacilityById(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <FacilityDetailComponent data={FacilityDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentFacilityDetail;
