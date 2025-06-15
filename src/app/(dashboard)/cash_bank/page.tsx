'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CashBankMenu = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/cash_bank');
  }, [router]);

  return null;
};

export default CashBankMenu;
