'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ManSkillDetailComponent from '@/components/apps/manufacturing/master_data/man/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetManByPkid } from '@/app/api/hooks/manufacturing/man/useGetManByPkid';

interface IManSkillDetail {
  pkid: number;
}

const ComponentManSkillDetail = ({ pkid }: IManSkillDetail) => {
  const pathname = usePathname();

  const { data: machineDetail, isLoading } = useGetManByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <ManSkillDetailComponent data={machineDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentManSkillDetail;
