import { Metadata } from 'next';

import AnimatedBackground from '@/components/auth/components-auth-loginanimatedbackground';
import LoginCard from '@/components/auth/components-auth-logincard';

export const metadata: Metadata = {
  title: 'Log in',
};

const LogIn = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <AnimatedBackground />
      <LoginCard />
    </div>
  );
};

export default LogIn;
