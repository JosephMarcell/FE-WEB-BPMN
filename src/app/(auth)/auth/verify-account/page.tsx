import { Metadata } from 'next';
import React from 'react';

import AnimatedBackground from '@/components/auth/components-auth-loginanimatedbackground';
import ComponentsAuthOTPForm from '@/components/auth/components-auth-verify-account-form';
import VerifyAccountCard from '@/components/auth/components-auth-verifyaccountcard';

export const metadata: Metadata = {
  title: 'Verify Account',
};

const VerifyAccount = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <AnimatedBackground />
      <VerifyAccountCard>
        <ComponentsAuthOTPForm />
      </VerifyAccountCard>
    </div>
  );
};

export default VerifyAccount;
