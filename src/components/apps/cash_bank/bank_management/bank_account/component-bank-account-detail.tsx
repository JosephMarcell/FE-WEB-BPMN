'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankAccountDetailComponent from '@/components/apps/cash_bank/bank_management/bank_account/_components/detail-page';

import { useGetBankAccountByPkid } from '@/app/api/hooks/cash_bank/bank_account/useGetBankAccountByPkid';

interface IBankAccountDetail {
  pkid: number;
}

const ComponentBankAccountDetail = ({ pkid }: IBankAccountDetail) => {
  const pathname = usePathname();

  const { data: bankAccountDetail, isLoading } = useGetBankAccountByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : bankAccountDetail ? (
          <BankAccountDetailComponent data={bankAccountDetail.result} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentBankAccountDetail;
