'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetPurchaseOrderByPkid } from '@/app/api/hooks/purchasing/purchase_order/useGetPurchaseOrderByPkid';

import PurchaseOrderDetailComponent from './_components/detail-page';

interface IPurchaseOrderDetail {
  pkid: number;
}
const ComponentOrderRequestDetail = ({ pkid }: IPurchaseOrderDetail) => {
  const pathname = usePathname();

  const { data: purchaseOrderDetail, isLoading } =
    useGetPurchaseOrderByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <PurchaseOrderDetailComponent data={purchaseOrderDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentOrderRequestDetail;
