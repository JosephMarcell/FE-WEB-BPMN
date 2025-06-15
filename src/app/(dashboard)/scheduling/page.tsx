'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SchedulingMenu = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return null;
};

export default SchedulingMenu;
