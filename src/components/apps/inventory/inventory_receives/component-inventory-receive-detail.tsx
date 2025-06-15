'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetInventoryReceiveByPkid } from '@/app/api/hooks/inventory/inventory_receive/useGetInventoryReceiveByPkid';

import InventoryReceiveDetailComponent from './_components/detail-page';

interface IInventoryReceiveDetail {
  pkid: number;
}
const ComponentInventoryReceiveDetail = ({ pkid }: IInventoryReceiveDetail) => {
  const pathname = usePathname();

  const { data: inventoryReceiveDetail, isLoading } =
    useGetInventoryReceiveByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <InventoryReceiveDetailComponent data={inventoryReceiveDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentInventoryReceiveDetail;
