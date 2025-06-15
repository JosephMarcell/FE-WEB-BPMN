'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PurchaseInvoiceDetailComponent from '@/components/apps/account_payable/purchase_invoice/_components/detail-page';

import { useGetPurchaseInvoiceByPkid } from '@/app/api/hooks/account_payable/purchase_invoice/useGetPurchaseInvoiceByPkid';

interface IPurchaseInvoiceDetail {
  pkid: number;
}

const ComponentPurchaseInvoiceDetail = ({ pkid }: IPurchaseInvoiceDetail) => {
  const pathname = usePathname();
  const { data: purchaseInvoiceDetail, isLoading } =
    useGetPurchaseInvoiceByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : purchaseInvoiceDetail ? (
          <PurchaseInvoiceDetailComponent data={purchaseInvoiceDetail.result} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentPurchaseInvoiceDetail;
