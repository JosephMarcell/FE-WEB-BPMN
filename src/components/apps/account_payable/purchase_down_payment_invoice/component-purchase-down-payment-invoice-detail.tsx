'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PurchaseDownPaymentInvoiceDetailComponent from '@/components/apps/account_payable/purchase_down_payment_invoice/_components/detail-page';

import { useGetPurchaseDownPaymentInvoiceByPkid } from '@/app/api/hooks/account_payable/purchase_down_payment_invoice/useGetPurchaseDownPaymentInvoiceByPkid';

interface IPurchaseDownPaymentInvoiceDetail {
  pkid: number;
}

const ComponentPurchaseDownPaymentInvoiceDetail = ({
  pkid,
}: IPurchaseDownPaymentInvoiceDetail) => {
  const pathname = usePathname();

  const { data: purchaseDownPaymentInvoiceDetail, isLoading } =
    useGetPurchaseDownPaymentInvoiceByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <PurchaseDownPaymentInvoiceDetailComponent
            data={purchaseDownPaymentInvoiceDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentPurchaseDownPaymentInvoiceDetail;
