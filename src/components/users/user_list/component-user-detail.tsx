'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import LoadingDetailPage from '@/components/commons/loading-detail-page';
import UserDetailComponent from '@/components/users/user_list/_components/detail-page-user';

import { useGetUserDetail } from '@/app/api/hooks/user_management/user/useGetUserDetail';

interface IUserDetail {
  pkid: string; // Ubah tipe dari number ke string
}

const ComponentUserDetail = ({ pkid }: IUserDetail) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log('Loading user detail with ID:', pkid);
  }, [pkid]);

  const { data: userDetail, isLoading, error } = useGetUserDetail(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : error ? (
          <div className='py-10 text-center text-red-500'>
            {error instanceof Error ? error.message : 'Terjadi kesalahan'}
          </div>
        ) : userDetail ? (
          <UserDetailComponent data={userDetail} />
        ) : (
          <div className='py-10 text-center text-gray-500'>
            User tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentUserDetail;
