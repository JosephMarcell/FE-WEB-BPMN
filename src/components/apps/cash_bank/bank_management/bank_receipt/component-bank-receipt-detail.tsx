'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankReceiptDetailComponent from '@/components/apps/cash_bank/bank_management/bank_receipt/_components/detail-page';

import { useGetBankReceiptByPkid } from '@/app/api/hooks/cash_bank/bank_receipt/useGetBankReceiptByPkid';

interface IBankReceiptDetail {
  pkid: number;
}

const ComponentBankReceiptDetail = ({ pkid }: IBankReceiptDetail) => {
  const pathname = usePathname();

  const { data: bankReceiptDetail, isLoading } = useGetBankReceiptByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : bankReceiptDetail ? (
          <BankReceiptDetailComponent data={bankReceiptDetail} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentBankReceiptDetail;
