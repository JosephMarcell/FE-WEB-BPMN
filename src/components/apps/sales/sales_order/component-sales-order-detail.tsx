'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetSupplierByPkid } from '@/app/api/hooks/purchasing/supplier/useGetSupplierByPkid';

import SalesOrderDetailComponent from './_components/detail-page';

interface IPurchaseRequestDetail {
  pkid: number;
}
const ComponentSalesOrderDetail = ({ pkid }: IPurchaseRequestDetail) => {
  const pathname = usePathname();

  const { data: supplierDetail, isLoading } = useGetSupplierByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <SalesOrderDetailComponent data={supplierDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentSalesOrderDetail;
