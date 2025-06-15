'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetInventoryTransferByPkid } from '@/app/api/hooks/inventory/inventory_transfer/useGetInventoryTransferByPkid';

import InventoryReceiveDetailComponent from './_components/detail-page';

interface IInventoryTransferDetail {
  pkid: number;
}
const ComponentInventoryTransferDetail = ({
  pkid,
}: IInventoryTransferDetail) => {
  const pathname = usePathname();

  const { data: inventoryTransferDetail, isLoading } =
    useGetInventoryTransferByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <InventoryReceiveDetailComponent data={inventoryTransferDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentInventoryTransferDetail;
