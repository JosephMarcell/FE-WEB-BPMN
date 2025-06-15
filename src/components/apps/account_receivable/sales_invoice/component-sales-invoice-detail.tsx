'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import SalesInvoiceDetailComponent from '@/components/apps/account_receivable/sales_invoice/_components/detail-page';

import { useGetSalesInvoiceByPkid } from '@/app/api/hooks/account_receivable/sales_invoice/useGetSalesInvoiceByPkid';

interface ISalesInvoiceDetail {
  pkid: number;
}

const ComponentSalesInvoiceDetail = ({ pkid }: ISalesInvoiceDetail) => {
  const pathname = usePathname();

  const { data: salesInvoiceDetail, isLoading } =
    useGetSalesInvoiceByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : salesInvoiceDetail ? (
          <SalesInvoiceDetailComponent data={salesInvoiceDetail.result} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentSalesInvoiceDetail;
