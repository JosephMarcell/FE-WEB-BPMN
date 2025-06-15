'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import COADetailComponent from '@/components/apps/general_ledger/coa/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetCoaByPkid } from '@/app/api/hooks/general_ledger/coa/useGetCoaByPkid';

interface ICOADetail {
  pkid: number;
}
const ComponentCOADetail = ({ pkid }: ICOADetail) => {
  const pathname = usePathname();

  const { data: COADetail, isLoading } = useGetCoaByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <COADetailComponent data={COADetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentCOADetail;
