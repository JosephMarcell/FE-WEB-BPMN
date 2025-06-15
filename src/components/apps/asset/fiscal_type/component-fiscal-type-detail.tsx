'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import FiscalTypeDetailComponent from '@/components/apps/asset/fiscal_type/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetFiscalTypeByPkid } from '@/app/api/hooks/fixed_asset/fiscal_type/useGetFiscalTypeByPkid';

interface IFiscalTypeDetail {
  pkid: number;
}
const ComponentFiscalTypeDetail = ({ pkid }: IFiscalTypeDetail) => {
  const pathname = usePathname();

  const { data: FiscalTypeDetail, isLoading } = useGetFiscalTypeByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <FiscalTypeDetailComponent data={FiscalTypeDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentFiscalTypeDetail;
