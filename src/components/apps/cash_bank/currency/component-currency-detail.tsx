'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CurrencyDetailComponent from '@/components/apps/cash_bank/currency/_components/detail-page';

import { useGetCurrencyByPkid } from '@/app/api/hooks/cash_bank/currency/useGetCurrencyByPkid';

interface ICurrencyDetail {
  pkid: number;
}

const ComponentCurrencyDetail = ({ pkid }: ICurrencyDetail) => {
  const pathname = usePathname();

  const { data: currencyDetail, isLoading } = useGetCurrencyByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : currencyDetail ? (
          <CurrencyDetailComponent data={currencyDetail} />
        ) : (
          'No data available'
        )}
      </div>
    </div>
  );
};

export default ComponentCurrencyDetail;
