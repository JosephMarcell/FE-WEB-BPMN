import { Metadata } from 'next';

import AnimatedBackground from '@/components/auth/components-auth-loginanimatedbackground';
import SignUpCard from '@/components/auth/components-auth-registercard';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUp = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <AnimatedBackground />
      <SignUpCard />
    </div>
  );
};

export default SignUp;
