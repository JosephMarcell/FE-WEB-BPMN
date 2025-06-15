'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetCustomerByPkid } from '@/app/api/hooks/sales/customer/useGetCustomerByPkid';

import CustomerDetailComponent from './_components/detail-page';

interface ICustomerDetail {
  pkid: number;
}
const ComponentCustomerDetail = ({ pkid }: ICustomerDetail) => {
  const pathname = usePathname();

  const { data: customerDetail, isLoading } = useGetCustomerByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <CustomerDetailComponent data={customerDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentCustomerDetail;
