'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import SalesDownPaymentInvoiceDetailComponent from '@/components/apps/account_receivable/sales_down_payment_invoice/_components/detail-page';

import { useGetSalesDownPaymentInvoiceByPkid } from '@/app/api/hooks/account_receivable/sales_down_payment_invoice/useGetSalesDownPaymentInvoiceByPkid';

interface ISalesDownPaymentInvoiceDetail {
  pkid: number;
}

const ComponentSalesDownPaymentInvoiceDetail = ({
  pkid,
}: ISalesDownPaymentInvoiceDetail) => {
  const pathname = usePathname();

  const { data: salesDownPaymentInvoiceDetail, isLoading } =
    useGetSalesDownPaymentInvoiceByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <SalesDownPaymentInvoiceDetailComponent
            data={salesDownPaymentInvoiceDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentSalesDownPaymentInvoiceDetail;
