'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';

import IconCaretDown from '@/components/icon/icon-caret-down';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconHelpCircle from '@/components/icon/icon-help-circle';
import IconSettings from '@/components/icon/icon-settings';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import HelpCenter from '@/components/layouts/help-center';
import MenuItem from '@/components/layouts/menu-item';

import { IRootState } from '@/store';
import { initializeSidebar, toggleSidebar } from '@/store/themeConfigSlice';

import { useGetUserProfile } from '@/app/api/hooks/Profile/useGetUserProfile';
import { ListMenu } from '@/constant/list_menu';
import { useHighlight } from '@/context/HighlightContext';

type SidebarProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ setShowModal }: SidebarProps) => {
  const dispatch = useDispatch();
  const { t } = getTranslation();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const isSidebarOpen = useSelector(
    (state: IRootState) => state.themeConfig.sidebar,
  );

  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark,
  );
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageListMenu, setPageListMenu] = useState(ListMenu);

  const toggleMenu = (value: string) => {
    setCurrentMenu(oldValue => (oldValue === value ? '' : value));
  };
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDashboardTutorial, setShowDashboardTutorial] = useState(false);
  const [showMenuTutorial, setShowMenuTutorial] = useState(false);
  const [showSettingsTutorial, setShowSettingsTutorial] = useState(false);
  const [showHelpTutorial, setShowHelpTutorial] = useState(false);

  const customToggleMenu = (label: string) => {
    setCurrentMenu(prevMenu => (prevMenu === label ? '' : label));
  };

  const handleMenuTutorial = () => {
    setShowDashboardTutorial(false);
    setShowMenuTutorial(!showMenuTutorial);
  };

  const handleSettingsTutorial = () => {
    setShowMenuTutorial(false);
    setShowSettingsTutorial(!showSettingsTutorial);
  };

  const handleHelpTutorial = () => {
    setShowSettingsTutorial(false);
    setShowHelpTutorial(!showHelpTutorial);
  };

  const closeSidebarTutorial = () => {
    setShowHelpTutorial(false);
    handleHighlight('');
    Cookies.remove('regisToken');
  };

  const isDashboardActive = pathname === '/' || pathname === '/live-tracking';

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      selector.classList.add('active');

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
  }, [pathname]);

  const { data: userData, isLoading: isProfileLoading } = useGetUserProfile();
  const isSuperAdmin = userData?.role === 'Superadmin';

  useEffect(() => {
    if (!isProfileLoading && isLoading) {
      const listMenuTemp = [...pageListMenu];
      listMenuTemp.forEach(menu => {
        if (menu.path === '/users') {
          menu.sub_menu?.forEach(subMenu => {
            if (subMenu.path === '/users/user_log') {
              subMenu.available = isSuperAdmin;
            }
          });
        }
      });
      setPageListMenu(listMenuTemp);
      setIsLoading(false);
    }
  }, [
    isProfileLoading,
    isLoading,
    setIsLoading,
    pageListMenu,
    isSuperAdmin,
    t,
  ]);

  useEffect(() => {
    if (isLoading) {
      const updatedMenus = pageListMenu.map(menu => ({
        ...menu,
        isActive: pathname.startsWith(menu.path), // Mark active menu based on pathname
      }));
      setPageListMenu(updatedMenus);
      setIsLoading(false);
    }
  }, [isLoading, setIsLoading, pageListMenu, pathname]);

  const { highlightedComponent, setHighlightedComponent } = useHighlight();

  const handleHighlight = (component: string) => {
    setHighlightedComponent(component);
  };

  useEffect(() => {
    const handleDashboardTutorial = () => {
      setShowDashboardTutorial(s => !s);
    };

    if (highlightedComponent === 'sidebar') {
      handleDashboardTutorial();
    }
  }, [highlightedComponent]);

  useEffect(() => {
    const activeMenu = pageListMenu.find(menu =>
      menu.sub_menu?.some(sub => sub.path === pathname),
    );

    if (activeMenu) {
      setCurrentMenu(activeMenu.label);
      setOpenMenus([activeMenu.label]);
    } else {
      setCurrentMenu('');
      setOpenMenus([]);
    }
  }, [pathname, pageListMenu]);

  useEffect(() => {
    dispatch(initializeSidebar());
    // dispatch(toggleSidebar());
  }, [dispatch]);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
          isSidebarOpen ? 'open' : 'collapsed'
        } ${semidark ? 'text-white-dark' : ''} ${
          highlightedComponent === 'sidebar' ? 'highlight' : ''
        }`}
      >
        <div className='h-full bg-white dark:bg-black'>
          <div className='flex items-center justify-between px-4 py-3'>
            <Link href='/' className='main-logo flex shrink-0 items-center'>
              <Image
                className='ml-[5px] w-8 flex-none'
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
              className='collapse-icon dark:text-white-light dark:hover:bg-dark-light/10 flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180'
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className='m-auto rotate-90' />
            </button>
          </div>
          <PerfectScrollbar className='relative flex h-[calc(100vh-80px)] flex-col'>
            <ul className='relative flex-grow space-y-0.5 p-4 py-0 font-semibold'>
              <li
                className={
                  showDashboardTutorial
                    ? 'menu nav-item flex flex-col bg-green-100 duration-300'
                    : 'menu nav-item flex flex-col'
                }
              >
                <button
                  type='button'
                  className={`${
                    isDashboardActive ? 'active' : ''
                  } nav-link group w-full`}
                  onClick={() => toggleMenu('dashboard')}
                >
                  <div className='flex items-center'>
                    <IconMenuDashboard className='group-hover:!text-primary shrink-0' />
                    <span className='dark:group-hover:text-white-dark text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690]'>
                      {t('dashboard')}
                    </span>
                  </div>

                  <div
                    className={
                      currentMenu !== 'dashboard'
                        ? '-rotate-90 rtl:rotate-90'
                        : ''
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight
                  duration={300}
                  height={currentMenu === 'dashboard' ? 'auto' : 0}
                >
                  <ul className='sub-menu text-gray-500'>
                    <li>
                      <Link
                        href='/'
                        className={pathname === '/' ? 'active' : ''} // Active class for 'general'
                      >
                        {t('General')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/live-tracking'
                        className={
                          pathname === '/live-tracking' ? 'active' : ''
                        } // Active class for 'live tracking'
                      >
                        {t('Live tracking')}
                      </Link>
                    </li>
                  </ul>
                </AnimateHeight>
              </li>
              {showDashboardTutorial && (
                <div className='z-50 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='font-bold'>Dashboard</h1>
                  <p className='font-normal'> {t('dashboard_explanation')} </p>
                  <button
                    className='btn btn-primary'
                    onClick={handleMenuTutorial}
                  >
                    {t('got_it')}
                  </button>
                </div>
              )}

              {!isLoading &&
                pageListMenu?.map((menu, index) => (
                  <div
                    key={index}
                    className={
                      showMenuTutorial ? ' bg-green-100 duration-300' : ''
                    }
                  >
                    <MenuItem
                      key={index}
                      menu={menu}
                      currentMenu={currentMenu}
                      toggleMenu={customToggleMenu}
                      openMenus={openMenus}
                      setOpenMenus={setOpenMenus}
                    />
                  </div>
                ))}
              {showMenuTutorial && (
                <div className='z-50 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                  <h1 className='font-bold'>Page Menu</h1>
                  <p className='font-normal'> {t('menu_explanation')} </p>
                  <button
                    className='btn btn-primary'
                    onClick={handleSettingsTutorial}
                  >
                    {t('got_it')}
                  </button>
                </div>
              )}
            </ul>

            <ul className='relative mt-auto space-y-0.5 p-4 font-semibold'>
              <li className='menu nav-item'>
                {showSettingsTutorial && (
                  <div className='z-50 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                    <h1 className='font-bold'> {t('settings')} </h1>
                    <p className='font-normal'> {t('settings_explanation')} </p>
                    <button
                      className='btn btn-primary'
                      onClick={handleHelpTutorial}
                    >
                      {t('got_it')}
                    </button>
                  </div>
                )}
                <button
                  type='button'
                  className={
                    showSettingsTutorial
                      ? 'nav-link group w-full bg-green-100 duration-300'
                      : 'nav-link group w-full'
                  }
                  onClick={() => setShowModal(true)}
                >
                  <div className='flex items-center'>
                    <IconSettings className='group-hover:!text-primary shrink-0' />
                    <span className='dark:group-hover:text-white-dark text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690]'>
                      Settings
                    </span>
                  </div>
                </button>
              </li>
              <li className='menu nav-item'>
                {showHelpTutorial && (
                  <div className='z-50 flex flex-col justify-center rounded-lg bg-white p-4 shadow-lg duration-300 dark:bg-black'>
                    <h1 className='font-bold'> {t('help_center')} </h1>
                    <p className='font-normal'> {t('help_explanation')} </p>
                    <button
                      className='btn btn-primary'
                      onClick={closeSidebarTutorial}
                    >
                      {t('got_it')}
                    </button>
                  </div>
                )}
                <button
                  type='button'
                  className={
                    showHelpTutorial
                      ? 'nav-link group w-full bg-green-100 duration-300'
                      : 'nav-link group w-full'
                  }
                  onClick={() => setShowHelpModal(true)}
                >
                  <div className='flex items-center'>
                    <IconHelpCircle className='group-hover:!text-primary shrink-0' />
                    <span className='dark:group-hover:text-white-dark text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690]'>
                      Help Center
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </PerfectScrollbar>

          <HelpCenter
            showModal={showHelpModal}
            setShowModal={setShowHelpModal}
          />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
