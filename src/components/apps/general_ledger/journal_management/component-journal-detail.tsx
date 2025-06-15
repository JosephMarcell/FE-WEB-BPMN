'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import JournalDetailComponent from '@/components/apps/general_ledger/journal_management/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetJournalByPkid } from '@/app/api/hooks/general_ledger/journal/useGetJournalByPkid';

interface IJournalDetail {
  pkid: number;
}
const ComponentJournalDetail = ({ pkid }: IJournalDetail) => {
  const pathname = usePathname();

  const { data: journalDetail, isLoading } = useGetJournalByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <JournalDetailComponent data={journalDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentJournalDetail;
