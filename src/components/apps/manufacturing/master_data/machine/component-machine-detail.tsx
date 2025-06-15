'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import MachineDetailComponent from '@/components/apps/manufacturing/master_data/machine/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetMachineByPkid } from '@/app/api/hooks/manufacturing/machine/useGetMachineByPkid';

interface IMachineDetail {
  pkid: number;
}

const ComponentMachineDetail = ({ pkid }: IMachineDetail) => {
  const pathname = usePathname();

  const { data: machineDetail, isLoading } = useGetMachineByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <MachineDetailComponent data={machineDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentMachineDetail;
