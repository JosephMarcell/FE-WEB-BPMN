'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashDisbursementDetailComponent from '@/components/apps/cash_bank/cash_management/cash_disbursement/_components/detail-page';

import { useGetCashDisbursementByPkid } from '@/app/api/hooks/cash_bank/cash_disbursement/useGetCashDisbursementByPkid';

interface ICashDisbursementDetail {
  pkid: number;
}

const ComponentCashDisbursementDetail = ({ pkid }: ICashDisbursementDetail) => {
  const pathname = usePathname();

  const { data: cashDisbursementDetail, isLoading } =
    useGetCashDisbursementByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : cashDisbursementDetail ? (
          <CashDisbursementDetailComponent data={cashDisbursementDetail} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentCashDisbursementDetail;
