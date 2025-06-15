import { Metadata } from 'next';
import React from 'react';

import ComponentsAuthChangePassword from '@/components/auth/components-auth-change-password';
import ChangePasswordCard from '@/components/auth/components-auth-changepasswordcard';
import AnimatedBackground from '@/components/auth/components-auth-loginanimatedbackground';

export const metadata: Metadata = {
  title: 'Change Password',
};

const ChangePassword = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <AnimatedBackground />
      <ChangePasswordCard>
        <ComponentsAuthChangePassword />
      </ChangePasswordCard>
    </div>
  );
};

export default ChangePassword;
