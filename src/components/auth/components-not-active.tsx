'use client';
import Cookies from 'js-cookie';
import React from 'react';

import { useLogOut } from '@/app/api/hooks/auth/useLogOut';

const ComponentsNotActive = () => {
  const { mutateAsync: logOut } = useLogOut();

  const handleSignOut = async () => {
    const token = Cookies.get('authToken');

    if (token) {
      await logOut({ token });
    }

    Cookies.remove('authToken');

    window.location.href = '/auth/login';
  };

  return (
    <div className='flex w-full flex-col items-center'>
      <h1 className='mt-8 text-4xl md:text-4xl'>
        Tenant is not active. Please contact admin to activate your tenant.
      </h1>
      <div className='mt-8 flex items-center justify-end'>
        <button
          onClick={handleSignOut}
          type='button'
          className='btn btn-primary ltr:ml-4 rtl:mr-4'
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ComponentsNotActive;
