'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import TransferMaterialDetailComponent from '@/components/apps/manufacturing/production/transfer_material/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetTransferMaterialByProductionOrderPkid } from '@/app/api/hooks/manufacturing/transfer_material/useGetTransferMaterialByProductionOrderPkid';

interface ITransferMaterialDetail {
  pkid: number;
}

const ComponentTransferMaterialDetail = ({ pkid }: ITransferMaterialDetail) => {
  const pathname = usePathname();

  const {
    data: transferMaterialDetail,
    isLoading,
    refetch,
  } = useGetTransferMaterialByProductionOrderPkid(pkid);
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <TransferMaterialDetailComponent
            data={transferMaterialDetail}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentTransferMaterialDetail;
