'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashReceiptDetailComponent from '@/components/apps/cash_bank/cash_management/cash_receipt/_components/detail-page';

import { useGetCashReceiptByPkid } from '@/app/api/hooks/cash_bank/cash_receipt/useGetCashReceiptByPkid';

interface ICashReceiptDetail {
  pkid: number;
}

const ComponentCashReceiptDetail = ({ pkid }: ICashReceiptDetail) => {
  const pathname = usePathname();

  const { data: cashReceiptDetail, isLoading } = useGetCashReceiptByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : cashReceiptDetail ? (
          <CashReceiptDetailComponent data={cashReceiptDetail} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentCashReceiptDetail;
