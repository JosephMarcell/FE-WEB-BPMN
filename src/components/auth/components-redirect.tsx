'use client';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
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

import { useCheckCredential } from '@/app/api/hooks/auth/useCheckCredential';
import { useCheckIP } from '@/app/api/hooks/auth/useCheckIP';

const ComponentsRedirect = () => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();
  const { initLocale } = getTranslation();

  const { mutateAsync: checkCredential } = useCheckCredential();
  const { data: ip, isLoading } = useCheckIP();

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
  }, [
    dispatch,
    initLocale,
    themeConfig.theme,
    themeConfig.menu,
    themeConfig.layout,
    themeConfig.rtlClass,
    themeConfig.animation,
    themeConfig.locale,
    themeConfig.navbar,
    themeConfig.semidark,
  ]);

  useEffect(() => {
    const triggerCheck = async () => {
      if (ip !== undefined) {
        try {
          const res = await checkCredential({ ip: ip });

          if (res.data.data.token !== '') {
            Cookies.set('authToken', res.data.data.token);
            window.location.href = '/';
          } else {
            Cookies.remove('authToken');
            window.location.href = '/auth/login';
          }
        } catch (error) {
          Cookies.remove('authToken');
          window.location.href = '/auth/login';
        }
      }
    };

    triggerCheck();
  }, [ip, checkCredential, isLoading]);

  return (
    <div
      className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${
        themeConfig.menu
      } ${themeConfig.layout} ${
        themeConfig.rtlClass
      } main-section font-nunito relative text-sm font-normal antialiased`}
    >
      <Loading />
    </div>
  );
};

export default ComponentsRedirect;
