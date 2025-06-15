'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashAccountDetailComponent from '@/components/apps/cash_bank/cash_management/cash_account/_components/detail-page';

import { useGetCashAccountByPkid } from '@/app/api/hooks/cash_bank/cash_account/useGetCashAccountByPkid';

interface ICashAccountDetail {
  pkid: number;
}

const ComponentCashAccountDetail = ({ pkid }: ICashAccountDetail) => {
  const pathname = usePathname();

  const { data: cashAccountDetail, isLoading } = useGetCashAccountByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : cashAccountDetail ? (
          <CashAccountDetailComponent data={cashAccountDetail.result} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentCashAccountDetail;
