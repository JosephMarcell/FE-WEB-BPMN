'use client';

import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import UserTable from '@/components/users/user_list/_components/list-table-user';
import ModalListUser from '@/components/users/user_list/_components/modal-list-user';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllUser } from '@/app/api/hooks/user_management/user/useGetAllUser';

const { t } = getTranslation();
const ComponentsUsersList = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const userRole = Cookies.get('userRole');

  // Redirect if user is not SUPERADMIN or ADMIN
  useEffect(() => {
    if (userRole === 'USER') {
      router.push('/'); // Redirect to home page
    }
  }, [userRole, router]);

  // If user is USER, don't render the component
  if (userRole === 'USER') {
    return null;
  }

  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listUserResponse, isLoading, refetch } = useGetAllUser();

  // Extract users from the response
  const listUser = listUserResponse?.data || [];

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        {t('add_new')} {t('users')}
      </button>
      <ModalListUser
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 '>
        <UserTable data={listUser} isLoading={isLoading} refetch={refetch} />
      </div>
    </div>
  );
};

export default ComponentsUsersList;
