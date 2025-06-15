'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetBillOfMaterialByPkid } from '@/app/api/hooks/inventory/bill_of_material/useGetBillOfMaterialByPkid';

import BillOfMaterialDetailComponent from './_components/detail-page';

interface IInventoryReceiveDetail {
  pkid: number;
}
const BillOfMaterialDetail = ({ pkid }: IInventoryReceiveDetail) => {
  const pathname = usePathname();

  const { data: billOfMaterialDetail, isLoading } =
    useGetBillOfMaterialByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <BillOfMaterialDetailComponent data={billOfMaterialDetail} />
        )}
      </div>
    </div>
  );
};

export default BillOfMaterialDetail;
