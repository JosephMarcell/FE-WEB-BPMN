'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetPurchaseRequestByPkid } from '@/app/api/hooks/purchasing/purchase_request/useGetPurchaseRequestByPkid';

import PurchaseRequestDetailComponent from './_components/detail-page';

interface IPurchaseRequestDetail {
  pkid: number;
}
const ComponentPurchaseRequestDetail = ({ pkid }: IPurchaseRequestDetail) => {
  const pathname = usePathname();

  const { data: purchaseRequestDetail, isLoading } =
    useGetPurchaseRequestByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <PurchaseRequestDetailComponent data={purchaseRequestDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentPurchaseRequestDetail;
