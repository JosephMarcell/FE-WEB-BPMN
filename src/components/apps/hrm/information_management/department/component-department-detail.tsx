'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import DepartmentDetail from '@/components/apps/hrm/information_management/department/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetDepartmentByPkid } from '@/app/api/hooks/hrm/department/useGetDepartmentByPkid';

interface IDepartmentDetail {
  pkid: number;
}
const ComponentDepartmentDetail = ({ pkid }: IDepartmentDetail) => {
  const pathname = usePathname();

  const { data: departmentDetail, isLoading } = useGetDepartmentByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <DepartmentDetail data={departmentDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentDepartmentDetail;
