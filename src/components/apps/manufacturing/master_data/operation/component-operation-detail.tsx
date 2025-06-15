'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import OperationDetailComponent from '@/components/apps/manufacturing/master_data/operation/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetOperationByPkid } from '@/app/api/hooks/manufacturing/operation/useGetOperationByPkid';

interface IOperationDetail {
  pkid: number;
}

const ComponentOperationDetail = ({ pkid }: IOperationDetail) => {
  const pathname = usePathname();

  const { data: operationDetail, isLoading } = useGetOperationByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <OperationDetailComponent data={operationDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentOperationDetail;
