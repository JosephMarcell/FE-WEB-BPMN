'use client';
import React from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '@/store';

const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  return (
    <div
      className={`${themeConfig.navbar} main-container dark:text-white-dark min-h-screen text-black`}
    >
      {' '}
      {children}
    </div>
  );
};

export default MainContainer;
