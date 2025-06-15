'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AssetMenu = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return null;
};

export default AssetMenu;
