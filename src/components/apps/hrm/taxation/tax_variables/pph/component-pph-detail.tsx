'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PPHDetailTable from '@/components/apps/hrm/taxation/tax_variables/pph/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetPPHData } from '@/app/api/hooks/hrm/tax_variables/pph/useGetPPHByPkid';
import { PPHProperty } from '@/helpers/utils/hrm/tax_variables/pph';

interface IRecruitmentRequestDetail {
  _: number;
}

const ComponentPPHDetail = ({ _ }: IRecruitmentRequestDetail) => {
  const pathname = usePathname();
  const category = pathname.split('/').pop();

  // Map numeric category to corresponding letter
  const categoryMap: { [key: string]: string } = {
    '1': 'A',
    '45': 'B',
    '85': 'C',
  };

  const mappedCategory = category ? categoryMap[category] || '' : '';

  const { data: pphDetail, isLoading, isError } = useGetPPHData();

  if (isLoading) {
    return <LoadingDetailPage />;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  // Filter data based on mapped category
  const filteredData = Array.isArray(pphDetail)
    ? pphDetail.filter((item: PPHProperty) => {
        return item.ter_category === mappedCategory;
      })
    : [];

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {filteredData.length > 0 ? (
          <PPHDetailTable data={filteredData} />
        ) : (
          <div>No data available for category {mappedCategory}</div>
        )}
      </div>
    </div>
  );
};

export default ComponentPPHDetail;
