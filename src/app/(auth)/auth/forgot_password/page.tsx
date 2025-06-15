import { Metadata } from 'next';
import React from 'react';

import ComponentsAuthForgotPassword from '@/components/auth/components-auth-forgot-password';
import ForgotPasswordCard from '@/components/auth/components-auth-forgotpasswordcard';
import AnimatedBackground from '@/components/auth/components-auth-loginanimatedbackground';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

const ForgotPassword = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <AnimatedBackground />
      <ForgotPasswordCard>
        <ComponentsAuthForgotPassword />
      </ForgotPasswordCard>
    </div>
  );
};

export default ForgotPassword;
