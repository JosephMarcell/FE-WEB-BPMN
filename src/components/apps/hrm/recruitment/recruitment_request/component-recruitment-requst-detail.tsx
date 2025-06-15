'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import RecruitmentRequestDetail from '@/components/apps/hrm/recruitment/recruitment_request/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetRecruitmentRequestByPkid } from '@/app/api/hooks/hrm/recruitment_request/useGetRecruitmentRequestByPkid';

interface IRecruitmentRequestDetail {
  pkid: number;
}
const ComponentRecruitmentRequestDetail = ({
  pkid,
}: IRecruitmentRequestDetail) => {
  const pathname = usePathname();

  const { data: recruitmentRequestDetail, isLoading } =
    useGetRecruitmentRequestByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <RecruitmentRequestDetail data={recruitmentRequestDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentRecruitmentRequestDetail;
