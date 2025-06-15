'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankDisbursementDetailComponent from '@/components/apps/cash_bank/bank_management/bank_disbursement/_components/detail-page';

import { useGetBankDisbursementByPkid } from '@/app/api/hooks/cash_bank/bank_disbursement/useGetBankDisbursementByPkid';

interface IBankDisbursementDetail {
  pkid: number;
}

const ComponentBankDisbursementDetail = ({ pkid }: IBankDisbursementDetail) => {
  const pathname = usePathname();

  const { data: bankDisbursementDetail, isLoading } =
    useGetBankDisbursementByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : bankDisbursementDetail ? (
          <BankDisbursementDetailComponent data={bankDisbursementDetail} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentBankDisbursementDetail;
