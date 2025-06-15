'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';

import Loading from '@/components/layouts/loading';

import { IRootState } from '@/store';
import {
  toggleAnimation,
  toggleLayout,
  toggleMenu,
  toggleNavbar,
  toggleRTL,
  toggleSemidark,
  toggleTheme,
} from '@/store/themeConfigSlice';

function App({ children }: PropsWithChildren) {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();
  const { initLocale } = getTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
    dispatch(
      toggleLayout(localStorage.getItem('layout') || themeConfig.layout),
    );
    dispatch(
      toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass),
    );
    dispatch(
      toggleAnimation(
        localStorage.getItem('animation') || themeConfig.animation,
      ),
    );
    dispatch(
      toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar),
    );
    dispatch(
      toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark),
    );
    // locale
    initLocale(themeConfig.locale);

    setIsLoading(false);
  }, [
    dispatch,
    initLocale,
    themeConfig.theme,
    themeConfig.menu,
    themeConfig.layout,
    themeConfig.rtlClass,
    themeConfig.animation,
    themeConfig.navbar,
    themeConfig.locale,
    themeConfig.semidark,
  ]);

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${
        themeConfig.menu
      } ${themeConfig.layout} ${
        themeConfig.rtlClass
      } main-section font-nunito relative text-sm font-normal antialiased`}
    >
      {isLoading ? <Loading /> : children}
    </div>
  );
}

export default App;
