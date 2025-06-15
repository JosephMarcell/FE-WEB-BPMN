'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';

const Overlay = () => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();
  return (
    <>
      {/* sidebar menu overlay */}
      <div
        className={`${
          (!themeConfig.sidebar && 'hidden') || ''
        } fixed inset-0 z-50 bg-[black]/60 lg:hidden`}
        onClick={() => dispatch(toggleSidebar())}
      ></div>
    </>
  );
};

export default Overlay;
