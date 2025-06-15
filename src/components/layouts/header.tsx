'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { logout } from '@/lib/auth';
import { getTranslation } from '@/lib/lang/i18n';

import Dropdown from '@/components/dropdown';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconBellBing from '@/components/icon/icon-bell-bing';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconLaptop from '@/components/icon/icon-laptop';
import IconLogout from '@/components/icon/icon-logout';
import IconMenu from '@/components/icon/icon-menu';
import IconMoon from '@/components/icon/icon-moon';
import IconSun from '@/components/icon/icon-sun';
import IconUser from '@/components/icon/icon-user';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconMenuApps from '@/components/icon/menu/icon-menu-apps';
import IconMenuComponents from '@/components/icon/menu/icon-menu-components';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables';
import IconMenuElements from '@/components/icon/menu/icon-menu-elements';
import IconMenuForms from '@/components/icon/menu/icon-menu-forms';
import IconMenuMore from '@/components/icon/menu/icon-menu-more';
import IconMenuPages from '@/components/icon/menu/icon-menu-pages';

import { IRootState } from '@/store';
import {
  toggleRTL,
  toggleSidebar,
  toggleTheme,
} from '@/store/themeConfigSlice';

import { Log, useGetUserLogs } from '@/app/api/hooks/Profile/useGetUserLogs';
import { useGetUserProfile } from '@/app/api/hooks/Profile/useGetUserProfile';
import { useHighlight } from '@/context/HighlightContext';
import { getTokenData } from '@/helpers/utils/common/token';

interface LanguageItem {
  code: string;
  name: string;
}

interface Notification {
  id: number;
  image: string;
  title: string;
  message: string;
  time: string;
}

const Header = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = getTranslation();
  const tokenData = getTokenData();
  const [showThemeTutorial, setShowThemeTutorial] = useState(false);
  const [showLanguageTutorial, setShowLanguageTutorial] = useState(false);
  const [showNotificationTutorial, setShowNotificationTutorial] =
    useState(false);
  const [showProfileTutorial, setShowProfileTutorial] = useState(false);

  const { data: userData } = useGetUserProfile();
  const { setHighlightedComponent, triggerSidebarTutorial } = useHighlight();

  const handleHighlight = useCallback(
    (component: string) => {
      setHighlightedComponent(component);
      if (component === 'sidebar') {
        triggerSidebarTutorial();
      }
    },
    [setHighlightedComponent, triggerSidebarTutorial],
  );

  const handleThemeTutorial = useCallback(() => {
    setShowThemeTutorial(prev => !prev);
    handleHighlight('header');
  }, [handleHighlight]);

  useEffect(() => {
    const registerToken = Cookies.get('regisToken');
    if (registerToken) {
      handleThemeTutorial();
    }

    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      const all: NodeListOf<Element> = document.querySelectorAll(
        'ul.horizontal-menu .nav-link.active',
      );
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active');
      }

      const allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
      for (let i = 0; i < allLinks.length; i++) {
        const element = allLinks[i];
        element?.classList.remove('active');
      }
      selector?.classList.add('active');

      const ul: Element | null = selector.closest('ul.sub-menu');

      if (ul) {
        const menuItem: Element | null = ul.closest('li.menu');
        if (menuItem) {
          const nodeList: NodeList = menuItem.querySelectorAll('.nav-link');
          if (nodeList.length > 0) {
            const ele: Element = nodeList[0] as Element;
            setTimeout(() => {
              ele?.classList.add('active');
            });
          }
        }
      }
    }
  }, [pathname, handleThemeTutorial]);

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const setLocale = (flag: string) => {
    if (flag.toLowerCase() === 'ae') {
      dispatch(toggleRTL('rtl'));
    } else {
      dispatch(toggleRTL('ltr'));
    }
    router.refresh();
  };

  function createMarkup(messages: string) {
    return { __html: messages };
  }

  const handleLanguageTutorial = () => {
    setShowThemeTutorial(false);
    setShowLanguageTutorial(!showLanguageTutorial);
  };

  const handleNotificationTutorial = () => {
    setShowLanguageTutorial(false);
    setShowNotificationTutorial(!showNotificationTutorial);
  };

  const handleProfileTutorial = () => {
    setShowNotificationTutorial(false);
    setShowProfileTutorial(!showProfileTutorial);
  };

  const closeHeaderTutorial = () => {
    setShowProfileTutorial(false);
    handleHighlight('sidebar');
  };

  const handleSignOut = () => {
    Swal.fire({
      title: t('confirm_logout'),
      text: t('logout_confirmation'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel'),
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await logout();
        } catch (error) {
          console.error('Error during logout:', error);
          // Fallback logout jika API gagal
          Cookies.remove('authToken');
          Cookies.remove('userName');
          Cookies.remove('userRole');
          Cookies.remove('userEmail');
          Cookies.remove('userId');
          window.location.href = '/auth/login';
        }
      }
    });
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: userLogs, isLoading } = useGetUserLogs();

  useEffect(() => {
    if (userLogs && !isLoading) {
      const filteredLogs = userLogs.filter(log =>
        ['LOGIN', 'REGISTER', 'RESET PASSWORD'].includes(log.activity_type),
      );

      const latestLogs = Object.values(
        filteredLogs.reduce((acc, log) => {
          if (
            !acc[log.activity_type] ||
            new Date(log.activity_time) >
              new Date(acc[log.activity_type].activity_time)
          ) {
            acc[log.activity_type] = log;
          }
          return acc;
        }, {} as Record<string, Log>),
      );

      const customNotifications = latestLogs.map(log => {
        let image = '';
        let message = '';
        switch (log.activity_type) {
          case 'LOGIN':
            image =
              '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>';
            message = 'You just logged into your account!';
            break;
          case 'REGISTER':
            image =
              '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>';
            message = 'You just registered an account!';
            break;
          case 'RESET PASSWORD':
            image =
              '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>';
            message = 'You just reset your password.';
            break;
          default:
            image =
              '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-stone-500 text-stone-500 dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>';
            message = 'Activity logged.';
        }

        return {
          id: log.pkid,
          image,
          title: log.activity_type,
          message,
          time: new Date(log.activity_time).toLocaleTimeString(),
        };
      });

      setNotifications(customNotifications);
    }
  }, [userLogs, isLoading]);

  const removeNotifications = (id: number) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id),
    );
  };

  return (
    <header
      className={`z-40 ${
        themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''
      }`}
      id='header'
    >
      <div className='shadow-sm'>
        <div className='relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black'>
          <div className='horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2'>
            <Link href='/' className='main-logo flex shrink-0 items-center'>
              <Image
                className='inline w-8 ltr:-ml-1 rtl:-mr-1'
                src='/assets/images/logo.svg'
                alt='logo'
                width={32}
                height={32}
              />
              <span className='hidden align-middle text-2xl  font-bold  text-[#0C445B] transition-all duration-300 md:inline ltr:ml-1.5 rtl:mr-1.5'>
                Drone<span className='text-[#0BA6A6]'>MEQ</span>
              </span>
            </Link>
            <button
              type='button'
              className='collapse-icon bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 dark:hover:text-primary flex flex-none rounded-full p-2 lg:hidden ltr:ml-2 rtl:mr-2 dark:text-[#d0d2d6]'
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconMenu className='h-5 w-5' />
            </button>
          </div>

          <div className='hidden sm:block ltr:mr-2 rtl:ml-2'>
            <ul className='flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]'>
              {/* <li>
                <Link
                  href='/apps/calendar'
                  className='bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 block rounded-full p-2'
                >
                  <IconCalendar />
                </Link>
              </li>
              <li>
                <Link
                  href='/apps/todolist'
                  className='bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 block rounded-full p-2'
                >
                  <IconEdit />
                </Link>
              </li> 
              <li>
                <Link
                  href='/apps/chat'
                  className='bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 block rounded-full p-2'
                >
                  <IconChatNotification />
                </Link>
              </li> */}
            </ul>
          </div>
          <div className='flex items-center space-x-1.5 sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0 dark:text-[#d0d2d6]'>
            <div className='sm:ltr:mr-auto sm:rtl:ml-auto'>
              {/* <form
                className={`${
                  search && '!block'
                } absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                onSubmit={() => setSearch(false)}
              >
                <div className='relative'>
                  <input
                    type='text'
                    className='form-input peer bg-gray-100 placeholder:tracking-widest sm:bg-transparent ltr:pl-9 ltr:pr-9 ltr:sm:pr-4 rtl:pl-9 rtl:pr-9 rtl:sm:pl-4'
                    placeholder='Search...'
                  />
                  <button
                    type='button'
                    className='peer-focus:text-primary absolute inset-0 h-9 w-9 appearance-none ltr:right-auto rtl:left-auto'
                  >
                    <IconSearch className='mx-auto' />
                  </button>
                  <button
                    type='button'
                    className='absolute top-1/2 block -translate-y-1/2 hover:opacity-80 sm:hidden ltr:right-2 rtl:left-2'
                    onClick={() => setSearch(false)}
                  >
                    <IconXCircle />
                  </button>
                </div>
              </form>
              <button
                type='button'
                onClick={() => setSearch(!search)}
                className='search_btn bg-white-light/40 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 rounded-full p-2 sm:hidden'
              >
                <IconSearch className='h-4.5 w-4.5 mx-auto dark:text-[#d0d2d6]' />
              </button> */}
            </div>

            <div>
              <button
                onClick={handleThemeTutorial}
                className={
                  themeConfig.theme === 'light'
                    ? 'bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex items-center rounded-full p-2 px-4 font-semibold'
                    : '  hover:text-primary bg-dark/40 hover:bg-dark/60 flex items-center rounded-full p-2 px-4 font-semibold'
                }
              >
                Tutorial
              </button>
            </div>
            {showThemeTutorial ? (
              <div>
                {themeConfig.theme === 'light' ? (
                  <button
                    className={`${
                      themeConfig.theme === 'light' &&
                      'hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex scale-150  items-center rounded-full bg-green-100 p-2 duration-300'
                    }`}
                    onClick={() => dispatch(toggleTheme('dark'))}
                  >
                    <IconSun />
                  </button>
                ) : (
                  ''
                )}
                {themeConfig.theme === 'dark' && (
                  <button
                    className={`${
                      themeConfig.theme === 'dark' &&
                      'hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex scale-150 items-center rounded-full bg-green-100 p-2 duration-300'
                    }`}
                    onClick={() => dispatch(toggleTheme('system'))}
                  >
                    <IconMoon />
                  </button>
                )}
                {themeConfig.theme === 'system' && (
                  <button
                    className={`${
                      themeConfig.theme === 'system' &&
                      'hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex scale-150 items-center rounded-full bg-green-100 p-2 duration-300'
                    }`}
                    onClick={() => dispatch(toggleTheme('light'))}
                  >
                    <IconLaptop />
                  </button>
                )}
                <div className='fixed z-50 mt-4 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='flex font-bold'> {t('theme_settings')} </h1>
                  <p> {t('theme_explanation')} </p>
                  <button
                    onClick={handleLanguageTutorial}
                    className='btn btn-primary justify-center rounded-md p-1'
                  >
                    {t('got_it')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {themeConfig.theme === 'light' ? (
                  <button
                    className={`${
                      themeConfig.theme === 'light' &&
                      'bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex items-center rounded-full p-2 duration-300'
                    }`}
                    onClick={() => dispatch(toggleTheme('dark'))}
                  >
                    <IconSun />
                  </button>
                ) : (
                  ''
                )}
                {themeConfig.theme === 'dark' && (
                  <button
                    className={`${
                      themeConfig.theme === 'dark' &&
                      'bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex items-center rounded-full p-2'
                    }`}
                    onClick={() => dispatch(toggleTheme('system'))}
                  >
                    <IconMoon />
                  </button>
                )}
                {themeConfig.theme === 'system' && (
                  <button
                    className={`${
                      themeConfig.theme === 'system' &&
                      'bg-white-light/40 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60 flex items-center rounded-full p-2'
                    }`}
                    onClick={() => dispatch(toggleTheme('light'))}
                  >
                    <IconLaptop />
                  </button>
                )}
              </div>
            )}
            {showLanguageTutorial ? (
              <div className='dropdown shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='block p-2 rounded-full bg-green-100 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60 scale-150 duration-300'
                  button={
                    i18n.language && (
                      <Image
                        className='h-5 w-5 rounded-full object-cover'
                        src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`}
                        alt='flag'
                        width={20}
                        height={20}
                      />
                    )
                  }
                >
                  <ul className='text-dark dark:text-white-dark dark:text-white-light/90 grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold'>
                    {themeConfig.languageList.map((item: LanguageItem) => {
                      return (
                        <li key={item.code}>
                          <button
                            type='button'
                            className={`hover:text-primary flex w-full ${
                              i18n.language === item.code
                                ? 'bg-primary/10 text-primary'
                                : ''
                            }`}
                            onClick={() => {
                              i18n.changeLanguage(item.code);
                              setLocale(item.code);
                              window.location.reload();
                            }}
                          >
                            <Image
                              src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                              alt='flag'
                              className='h-5 w-5 rounded-full object-cover'
                              width={20}
                              height={20}
                            />
                            <span className='ltr:ml-3 rtl:mr-3'>
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
                <div className='fixed z-50 mt-4 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='flex font-bold'> {t('language_settings')} </h1>
                  <p> {t('language_choice')} </p>
                  <button
                    onClick={handleNotificationTutorial}
                    className='btn btn-primary justify-center rounded-md p-1'
                  >
                    {t('got_it')}
                  </button>
                </div>
              </div>
            ) : (
              <div className='dropdown shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='block duration-300 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                  button={
                    i18n.language && (
                      <Image
                        className='h-5 w-5 rounded-full object-cover'
                        src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`}
                        alt='flag'
                        width={20}
                        height={20}
                      />
                    )
                  }
                >
                  <ul className='text-dark dark:text-white-dark dark:text-white-light/90 grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold'>
                    {themeConfig.languageList.map((item: LanguageItem) => {
                      return (
                        <li key={item.code}>
                          <button
                            type='button'
                            className={`hover:text-primary flex w-full ${
                              i18n.language === item.code
                                ? 'bg-primary/10 text-primary'
                                : ''
                            }`}
                            onClick={() => {
                              i18n.changeLanguage(item.code);
                              setLocale(item.code);
                              window.location.reload();
                            }}
                          >
                            <Image
                              src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                              alt='flag'
                              className='h-5 w-5 rounded-full object-cover'
                              width={20}
                              height={20}
                            />
                            <span className='ltr:ml-3 rtl:mr-3'>
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              </div>
            )}

            {showNotificationTutorial ? (
              <div className='dropdown shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                  button={
                    <span>
                      <IconBellBing />
                      <span className='absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0'>
                        <span className='bg-success/50 absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full opacity-75 ltr:-left-[3px] rtl:-right-[3px]'></span>
                        <span className='bg-success relative inline-flex h-[6px] w-[6px] rounded-full'></span>
                      </span>
                    </span>
                  }
                >
                  <ul className='text-dark dark:text-white-dark w-[300px] !py-0 text-xs sm:w-[375px]'>
                    {notifications.length > 0 ? (
                      <>
                        <li>
                          {notifications.map(notification => {
                            return (
                              <div
                                key={notification.id}
                                className='flex items-center px-5 py-3'
                              >
                                <div
                                  dangerouslySetInnerHTML={createMarkup(
                                    notification.image,
                                  )}
                                ></div>
                                <span className='px-3 dark:text-gray-500'>
                                  <div className='dark:text-white-light/90 text-sm font-semibold'>
                                    {notification.title}
                                  </div>
                                  <div>{notification.message}</div>
                                </span>
                                <span className='bg-white-dark/20 text-dark/60 dark:text-white-dark whitespace-pre rounded px-1 font-semibold ltr:ml-auto ltr:mr-2 rtl:ml-2 rtl:mr-auto'>
                                  {notification.time}
                                </span>
                                <button
                                  type='button'
                                  className='hover:text-danger text-neutral-300'
                                  onClick={() =>
                                    removeNotifications(notification.id)
                                  }
                                >
                                  <IconXCircle />
                                </button>
                              </div>
                            );
                          })}
                        </li>
                        <li className='border-white-light mt-5 border-t text-center dark:border-white/10'>
                          <button
                            type='button'
                            className='text-primary group !h-[48px] justify-center !py-4 font-semibold dark:text-gray-400'
                          >
                            <span className='group-hover:underline ltr:mr-1 rtl:ml-1'>
                              VIEW ALL ACTIVITIES
                            </span>
                            <IconArrowLeft className='transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1' />
                          </button>
                        </li>
                      </>
                    ) : (
                      <li className='p-4 text-center text-sm text-gray-500'>
                        No notifications available.
                      </li>
                    )}
                  </ul>
                </Dropdown>
                <div className='fixed z-50 mr-2 mt-4 flex -translate-x-8 flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='flex font-bold'> {t('notifications')} </h1>
                  <p> {t('notifications_explanation')} </p>
                  <button
                    onClick={handleProfileTutorial}
                    className='btn btn-primary justify-center rounded-md p-1'
                  >
                    {t('got_it')}
                  </button>
                </div>
              </div>
            ) : (
              <div className='dropdown shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                  button={
                    <span>
                      <IconBellBing />
                      <span className='absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0'>
                        <span className='bg-success/50 absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full opacity-75 ltr:-left-[3px] rtl:-right-[3px]'></span>
                        <span className='bg-success relative inline-flex h-[6px] w-[6px] rounded-full'></span>
                      </span>
                    </span>
                  }
                >
                  <ul className='text-dark dark:text-white-dark w-[300px] !py-0 text-xs sm:w-[375px]'>
                    {notifications.length > 0 ? (
                      <>
                        <li>
                          {notifications.map(notification => {
                            return (
                              <div
                                key={notification.id}
                                className='flex items-center px-5 py-3'
                              >
                                <div
                                  dangerouslySetInnerHTML={createMarkup(
                                    notification.image,
                                  )}
                                ></div>
                                <span className='px-3 dark:text-gray-500'>
                                  <div className='dark:text-white-light/90 text-sm font-semibold'>
                                    {notification.title}
                                  </div>
                                  <div>{notification.message}</div>
                                </span>
                                <span className='bg-white-dark/20 text-dark/60 dark:text-white-dark whitespace-pre rounded px-1 font-semibold ltr:ml-auto ltr:mr-2 rtl:ml-2 rtl:mr-auto'>
                                  {notification.time}
                                </span>
                                <button
                                  type='button'
                                  className='hover:text-danger text-neutral-300'
                                  onClick={() =>
                                    removeNotifications(notification.id)
                                  }
                                >
                                  <IconXCircle />
                                </button>
                              </div>
                            );
                          })}
                        </li>
                        <li className='border-white-light mt-5 border-t text-center dark:border-white/10'>
                          <button
                            type='button'
                            className='text-primary group !h-[48px] justify-center !py-4 font-semibold dark:text-gray-400'
                          >
                            <span className='group-hover:underline ltr:mr-1 rtl:ml-1'>
                              VIEW ALL ACTIVITIES
                            </span>
                            <IconArrowLeft className='transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1' />
                          </button>
                        </li>
                      </>
                    ) : (
                      <li className='p-4 text-center text-sm text-gray-500'>
                        No notifications available.
                      </li>
                    )}
                  </ul>
                </Dropdown>
              </div>
            )}

            {showProfileTutorial ? (
              <div className='dropdown flex shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='relative group block duration-300 scale-150'
                  button={
                    <Image
                      className='h-9 w-9 rounded-full object-cover saturate-50  group-hover:saturate-100'
                      src={
                        userData?.avatar || '/assets/images/profile-unknown.jpg'
                      }
                      alt='userProfile'
                      width={36}
                      height={36}
                    />
                  }
                >
                  <ul className='text-dark dark:text-white-dark dark:text-white-light/90 w-[230px] !py-0 font-semibold'>
                    <li>
                      <div className='flex items-center px-4 py-4'>
                        <Image
                          className='h-10 w-10 rounded-md object-cover'
                          src={
                            userData?.avatar ||
                            '/assets/images/profile-unknown.jpg'
                          }
                          alt='userProfile'
                          width={40}
                          height={40}
                        />
                        <div className='truncate ltr:pl-4 rtl:pr-4'>
                          <h4 className='text-base'>
                            {tokenData.fullname}
                            {/* <span className='bg-success-light text-success rounded px-1 text-xs ltr:ml-2 rtl:ml-2'>
                            Pro
                          </span> */}
                          </h4>
                          <button
                            type='button'
                            className='hover:text-primary dark:text-dark-light/60 text-black/60 dark:hover:text-white'
                          >
                            {tokenData.email}
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          (window.location.href = '/users/profile')
                        }
                        className='dark:hover:text-white'
                      >
                        <IconUser className='h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2' />
                        Profile
                      </button>
                    </li>
                    <li className='border-white-light dark:border-white-light/10 border-t'>
                      <button
                        className='text-danger !py-3'
                        onClick={handleSignOut}
                      >
                        <IconLogout className='h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2' />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </Dropdown>
                <div className='fixed z-50 mt-4 flex -translate-x-8 translate-y-8 flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='flex font-bold'> {t('profile')} </h1>
                  <p> {t('profile_explanation')} </p>
                  <button
                    onClick={closeHeaderTutorial}
                    className='btn btn-primary justify-center rounded-md p-1'
                  >
                    {t('got_it')}
                  </button>
                </div>
              </div>
            ) : (
              <div className='dropdown flex shrink-0'>
                <Dropdown
                  offset={[0, 8]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName='relative group block duration-300'
                  button={
                    <Image
                      className='h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100'
                      src={
                        userData?.avatar || '/assets/images/profile-unknown.jpg'
                      }
                      alt='userProfile'
                      width={36}
                      height={36}
                    />
                  }
                >
                  <ul className='text-dark dark:text-white-dark dark:text-white-light/90 w-[230px] !py-0 font-semibold'>
                    <li>
                      <div className='flex items-center px-4 py-4'>
                        <Image
                          className='h-10 w-10 rounded-md object-cover'
                          src={
                            userData?.avatar ||
                            '/assets/images/profile-unknown.jpg'
                          }
                          alt='userProfile'
                          width={40}
                          height={40}
                        />
                        <div className='truncate ltr:pl-4 rtl:pr-4'>
                          <h4 className='text-base'>
                            {tokenData.fullname}
                            {/* <span className='bg-success-light text-success rounded px-1 text-xs ltr:ml-2 rtl:ml-2'>
                            Pro
                          </span> */}
                          </h4>
                          <button
                            type='button'
                            className='hover:text-primary dark:text-dark-light/60 text-black/60 dark:hover:text-white'
                          >
                            {tokenData.email}
                          </button>
                        </div>
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          (window.location.href = '/users/profile')
                        }
                        className='dark:hover:text-white'
                      >
                        <IconUser className='h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2' />
                        Profile
                      </button>
                    </li>
                    <li className='border-white-light dark:border-white-light/10 border-t'>
                      <button
                        className='text-danger !py-3'
                        onClick={handleSignOut}
                      >
                        <IconLogout className='h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2' />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            )}
          </div>
        </div>

        {/* horizontal menu */}
        <ul className='horizontal-menu dark:text-white-dark hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black'>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuDashboard className='shrink-0' />
                <span className='px-1'>{t('dashboard')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/'>{t('General')}</Link>
              </li>
              <li>
                <Link href='/live-tracking'>{t('Live tracking')}</Link>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuApps className='shrink-0' />
                <span className='px-1'>{t('apps')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/apps/chat'>{t('chat')}</Link>
              </li>
              <li>
                <Link href='/apps/mailbox'>{t('mailbox')}</Link>
              </li>
              <li>
                <Link href='/apps/todolist'>{t('todo_list')}</Link>
              </li>
              <li>
                <Link href='/apps/notes'>{t('notes')}</Link>
              </li>
              <li>
                <Link href='/apps/scrumboard'>{t('scrumboard')}</Link>
              </li>
              <li>
                <Link href='/apps/contacts'>{t('contacts')}</Link>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('invoice')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/apps/invoice/list'>{t('list')}</Link>
                  </li>
                  <li>
                    <Link href='/apps/invoice/preview'>{t('preview')}</Link>
                  </li>
                  <li>
                    <Link href='/apps/invoice/add'>{t('add')}</Link>
                  </li>
                  <li>
                    <Link href='/apps/invoice/edit'>{t('edit')}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href='/apps/calendar'>{t('calendar')}</Link>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuComponents className='shrink-0' />
                <span className='px-1'>{t('components')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/components/tabs'>{t('tabs')}</Link>
              </li>
              <li>
                <Link href='/components/accordions'>{t('accordions')}</Link>
              </li>
              <li>
                <Link href='/components/modals'>{t('modals')}</Link>
              </li>
              <li>
                <Link href='/components/cards'>{t('cards')}</Link>
              </li>
              <li>
                <Link href='/components/carousel'>{t('carousel')}</Link>
              </li>
              <li>
                <Link href='/components/countdown'>{t('countdown')}</Link>
              </li>
              <li>
                <Link href='/components/counter'>{t('counter')}</Link>
              </li>
              <li>
                <Link href='/components/sweetalert'>{t('sweet_alerts')}</Link>
              </li>
              <li>
                <Link href='/components/timeline'>{t('timeline')}</Link>
              </li>
              <li>
                <Link href='/components/notifications'>
                  {t('notifications')}
                </Link>
              </li>
              <li>
                <Link href='/components/media-object'>{t('media_object')}</Link>
              </li>
              <li>
                <Link href='/components/list-group'>{t('list_group')}</Link>
              </li>
              <li>
                <Link href='/components/pricing-table'>
                  {t('pricing_tables')}
                </Link>
              </li>
              <li>
                <Link href='/components/lightbox'>{t('lightbox')}</Link>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuElements className='shrink-0' />
                <span className='px-1'>{t('elements')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/elements/alerts'>{t('alerts')}</Link>
              </li>
              <li>
                <Link href='/elements/avatar'>{t('avatar')}</Link>
              </li>
              <li>
                <Link href='/elements/badges'>{t('badges')}</Link>
              </li>
              <li>
                <Link href='/elements/breadcrumbs'>{t('breadcrumbs')}</Link>
              </li>
              <li>
                <Link href='/elements/buttons'>{t('buttons')}</Link>
              </li>
              <li>
                <Link href='/elements/buttons-group'>{t('button_groups')}</Link>
              </li>
              <li>
                <Link href='/elements/color-library'>{t('color_library')}</Link>
              </li>
              <li>
                <Link href='/elements/dropdown'>{t('dropdown')}</Link>
              </li>
              <li>
                <Link href='/elements/infobox'>{t('infobox')}</Link>
              </li>
              <li>
                <Link href='/elements/jumbotron'>{t('jumbotron')}</Link>
              </li>
              <li>
                <Link href='/elements/loader'>{t('loader')}</Link>
              </li>
              <li>
                <Link href='/elements/pagination'>{t('pagination')}</Link>
              </li>
              <li>
                <Link href='/elements/popovers'>{t('popovers')}</Link>
              </li>
              <li>
                <Link href='/elements/progress-bar'>{t('progress_bar')}</Link>
              </li>
              <li>
                <Link href='/elements/search'>{t('search')}</Link>
              </li>
              <li>
                <Link href='/elements/tooltips'>{t('tooltips')}</Link>
              </li>
              <li>
                <Link href='/elements/treeview'>{t('treeview')}</Link>
              </li>
              <li>
                <Link href='/elements/typography'>{t('typography')}</Link>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuDatatables className='shrink-0' />
                <span className='px-1'>{t('tables')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/tables'>{t('tables')}</Link>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('datatables')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/datatables/basic'>{t('basic')}</Link>
                  </li>
                  <li>
                    <Link href='/datatables/advanced'>{t('advanced')}</Link>
                  </li>
                  <li>
                    <Link href='/datatables/skin'>{t('skin')}</Link>
                  </li>
                  <li>
                    <Link href='/datatables/order-sorting'>
                      {t('order_sorting')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/datatables/multi-column'>
                      {t('multi_column')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/datatables/multiple-tables'>
                      {t('multiple_tables')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/datatables/alt-pagination'>
                      {t('alt_pagination')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/datatables/checkbox'>{t('checkbox')}</Link>
                  </li>
                  <li>
                    <Link href='/datatables/range-search'>
                      {t('range_search')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/datatables/export'>{t('export')}</Link>
                  </li>
                  <li>
                    <Link href='/datatables/column-chooser'>
                      {t('column_chooser')}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuForms className='shrink-0' />
                <span className='px-1'>{t('forms')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/forms/basic'>{t('basic')}</Link>
              </li>
              <li>
                <Link href='/forms/input-group'>{t('input_group')}</Link>
              </li>
              <li>
                <Link href='/forms/layouts'>{t('layouts')}</Link>
              </li>
              <li>
                <Link href='/forms/validation'>{t('validation')}</Link>
              </li>
              <li>
                <Link href='/forms/input-mask'>{t('input_mask')}</Link>
              </li>
              <li>
                <Link href='/forms/select2'>{t('select2')}</Link>
              </li>
              <li>
                <Link href='/forms/touchspin'>{t('touchspin')}</Link>
              </li>
              <li>
                <Link href='/forms/checkbox-radio'>
                  {t('checkbox_and_radio')}
                </Link>
              </li>
              <li>
                <Link href='/forms/switches'>{t('switches')}</Link>
              </li>
              <li>
                <Link href='/forms/wizards'>{t('wizards')}</Link>
              </li>
              <li>
                <Link href='/forms/file-upload'>{t('file_upload')}</Link>
              </li>
              <li>
                <Link href='/forms/quill-editor'>{t('quill_editor')}</Link>
              </li>
              <li>
                <Link href='/forms/markdown-editor'>
                  {t('markdown_editor')}
                </Link>
              </li>
              <li>
                <Link href='/forms/date-picker'>
                  {t('date_and_range_picker')}
                </Link>
              </li>
              <li>
                <Link href='/forms/clipboard'>{t('clipboard')}</Link>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuPages className='shrink-0' />
                <span className='px-1'>{t('pages')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li className='relative'>
                <button type='button'>
                  {t('users')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/users/profile'>{t('profile')}</Link>
                  </li>
                  <li>
                    <Link href='/users/user-account-settings'>
                      {t('account_settings')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href='/pages/knowledge-base'>{t('knowledge_base')}</Link>
              </li>
              <li>
                <Link href='/pages/contact-us-boxed' target='_blank'>
                  {t('contact_us_boxed')}
                </Link>
              </li>
              <li>
                <Link href='/pages/contact-us-cover' target='_blank'>
                  {t('contact_us_cover')}
                </Link>
              </li>
              <li>
                <Link href='/pages/faq'>{t('faq')}</Link>
              </li>
              <li>
                <Link href='/pages/coming-soon-boxed' target='_blank'>
                  {t('coming_soon_boxed')}
                </Link>
              </li>
              <li>
                <Link href='/pages/coming-soon-cover' target='_blank'>
                  {t('coming_soon_cover')}
                </Link>
              </li>
              <li>
                <Link href='/pages/maintenence' target='_blank'>
                  {t('maintenence')}
                </Link>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('error')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/pages/error404' target='_blank'>
                      {t('404')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/pages/error500' target='_blank'>
                      {t('500')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/pages/error503' target='_blank'>
                      {t('503')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('login')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/auth/cover-login' target='_blank'>
                      {t('login_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/auth/login' target='_blank'>
                      {t('login_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('register')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/auth/cover-register' target='_blank'>
                      {t('register_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/auth/signup' target='_blank'>
                      {t('register_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('password_recovery')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/auth/cover-password-reset' target='_blank'>
                      {t('recover_id_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/auth/boxed-password-reset' target='_blank'>
                      {t('recover_id_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='relative'>
                <button type='button'>
                  {t('lockscreen')}
                  <div className='-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90'>
                    <IconCaretDown />
                  </div>
                </button>
                <ul className='text-dark dark:text-white-dark absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b]'>
                  <li>
                    <Link href='/auth/cover-lockscreen' target='_blank'>
                      {t('unlock_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link href='/auth/boxed-lockscreen' target='_blank'>
                      {t('unlock_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className='menu nav-item relative'>
            <button type='button' className='nav-link'>
              <div className='flex items-center'>
                <IconMenuMore className='shrink-0' />
                <span className='px-1'>{t('more')}</span>
              </div>
              <div className='right_arrow'>
                <IconCaretDown />
              </div>
            </button>
            <ul className='sub-menu'>
              <li>
                <Link href='/dragndrop'>{t('drag_and_drop')}</Link>
              </li>
              <li>
                <Link href='/charts'>{t('charts')}</Link>
              </li>
              <li>
                <Link href='/font-icons'>{t('font_icons')}</Link>
              </li>
              <li>
                <Link href='/widgets'>{t('widgets')}</Link>
              </li>
              <li>
                <Link href='https://vristo.sbthemes.com' target='_blank'>
                  {t('documentation')}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
