import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

import { UserDetail } from '@/app/api/hooks/user_management/user/useGetUserDetail';
import { UserRole, UserStatus } from '@/helpers/utils/global/listUser';

const { t } = getTranslation();

interface IUserListDetail {
  data: UserDetail;
}

const UserListDetailComponent = ({ data }: IUserListDetail) => {
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='mb-6 flex justify-center'>
            <div className='dark:ring-dark shrink-0 rounded-full ring-4 ring-[#8A33EA]'>
              {/* Avatar tidak ada di API, pakai default */}
              <img
                src='/assets/images/profile-unknown.jpg'
                alt={t('user_avatar')}
                width={128}
                height={128}
                className='h-24 w-24 rounded-full object-cover'
              />
            </div>
          </div>
          <div>
            <label htmlFor='id'>ID</label>
            <input
              id='id'
              name='id'
              type='text'
              className='form-input'
              value={data.id}
              disabled
              readOnly
            />
          </div>
          <div>
            <label htmlFor='user_name'>{t('username')}</label>
            <input
              id='user_name'
              name='user_name'
              type='text'
              className='form-input'
              value={data.username}
              disabled
              readOnly
            />
          </div>
          <div>
            <label htmlFor='full_name'>{t('full_name')}</label>
            <input
              id='full_name'
              name='full_name'
              type='text'
              className='form-input'
              value={data.full_name}
              disabled
              readOnly
            />
          </div>
          <div>
            <label htmlFor='email'>{t('email')}</label>
            <input
              id='email'
              name='email'
              type='text'
              className='form-input'
              value={data.email}
              disabled
              readOnly
            />
          </div>
          <div>
            <label htmlFor='alamat'>{t('alamat')}</label>
            <input
              id='alamat'
              name='alamat'
              type='text'
              className='form-input'
              value={data.alamat}
              disabled
              readOnly
            />
          </div>
          <div className='flex flex-row gap-2'>
            <div className='flex-1'>
              <label htmlFor='role'>{t('role')}</label>
              <input
                id='role'
                name='role'
                className={`form-input max-w-[200px] rounded-md text-center text-white bg-${
                  UserRole.find(x => x.value === data.role)?.color || 'gray-400'
                }`}
                disabled
                readOnly
                value={
                  UserRole.find(x => x.value === data.role)?.label ||
                  data.role ||
                  ''
                }
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='status'>{t('status')}</label>
              <input
                id='status'
                name='status'
                className={`form-input max-w-[200px] rounded-md text-center text-white bg-${
                  UserStatus.find(x => x.value === data.is_verified)?.color ||
                  'gray-400'
                }`}
                disabled
                readOnly
                value={
                  UserStatus.find(x => x.value === data.is_verified)?.label ||
                  (data.is_verified ? 'Verified' : 'Not Verified')
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListDetailComponent;
