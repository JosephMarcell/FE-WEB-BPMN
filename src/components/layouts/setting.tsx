'use client';
import { useDispatch, useSelector } from 'react-redux';

import IconLaptop from '@/components/icon/icon-laptop';
import IconMoon from '@/components/icon/icon-moon';
import IconSun from '@/components/icon/icon-sun';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';
import {
  resetToggleSidebar,
  toggleAnimation,
  toggleLayout,
  toggleMenu,
  toggleNavbar,
  toggleTheme,
} from '@/store/themeConfigSlice';

const Setting = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const dispatch = useDispatch();

  if (!showModal) return null;

  return (
    <div className='fixed inset-0 z-[51] flex items-center justify-center bg-[black]/60'>
      <div className='relative max-h-screen w-full max-w-lg overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-black'>
        {/* Close button */}
        <button
          type='button'
          className='absolute right-2 top-2 text-black dark:text-white'
          onClick={() => setShowModal(false)}
        >
          <IconX className='h-5 w-5' />
        </button>

        <h4 className='mb-4 text-lg font-bold dark:text-white'>
          TEMPLATE CUSTOMIZER
        </h4>

        <div className='space-y-6'>
          {/* Color Scheme Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Color Scheme
            </h5>
            <p className='text-white-dark text-xs'>
              Overall light or dark presentation.
            </p>
            <div className='mt-3 grid grid-cols-3 gap-2'>
              <button
                type='button'
                className={`${
                  themeConfig.theme === 'light'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('light'))}
              >
                <IconSun className='h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2' />
                Light
              </button>

              <button
                type='button'
                className={`${
                  themeConfig.theme === 'dark'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('dark'))}
              >
                <IconMoon className='h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2' />
                Dark
              </button>

              <button
                type='button'
                className={`${
                  themeConfig.theme === 'system'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => dispatch(toggleTheme('system'))}
              >
                <IconLaptop className='h-5 w-5 shrink-0 ltr:mr-2 rtl:ml-2' />
                System
              </button>
            </div>
          </div>

          {/* Navigation Position Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Navigation Position
            </h5>
            <p className='text-white-dark text-xs'>
              Select the primary navigation paradigm for your app.
            </p>
            <div className='mt-3 grid grid-cols-3 gap-2'>
              <button
                type='button'
                className={`${
                  themeConfig.menu === 'horizontal'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => {
                  dispatch(toggleMenu('horizontal'));
                  dispatch(resetToggleSidebar());
                }}
              >
                Horizontal
              </button>

              <button
                type='button'
                className={`${
                  themeConfig.menu === 'vertical'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => {
                  dispatch(toggleMenu('vertical'));
                  dispatch(resetToggleSidebar());
                }}
              >
                Vertical
              </button>

              <button
                type='button'
                className={`${
                  themeConfig.menu === 'collapsible-vertical'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn`}
                onClick={() => {
                  dispatch(toggleMenu('collapsible-vertical'));
                  dispatch(resetToggleSidebar());
                }}
              >
                Collapsible
              </button>
            </div>
          </div>

          {/* Layout Style Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Layout Style
            </h5>
            <p className='text-white-dark text-xs'>
              Select the primary layout style for your app.
            </p>
            <div className='mt-3 flex gap-2'>
              <button
                type='button'
                className={`${
                  themeConfig.layout === 'boxed-layout'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleLayout('boxed-layout'))}
              >
                Box
              </button>

              <button
                type='button'
                className={`${
                  themeConfig.layout === 'full'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                } btn flex-auto`}
                onClick={() => dispatch(toggleLayout('full'))}
              >
                Full
              </button>
            </div>
          </div>

          {/* Navbar Type Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Navbar Type
            </h5>
            <p className='text-white-dark text-xs'>Sticky or Floating.</p>
            <div className='text-primary mt-3 flex items-center gap-3'>
              <label className='mb-0 inline-flex'>
                <input
                  type='radio'
                  checked={themeConfig.navbar === 'navbar-sticky'}
                  value='navbar-sticky'
                  className='form-radio'
                  onChange={() => dispatch(toggleNavbar('navbar-sticky'))}
                />
                <span>Sticky</span>
              </label>
              <label className='mb-0 inline-flex'>
                <input
                  type='radio'
                  checked={themeConfig.navbar === 'navbar-floating'}
                  value='navbar-floating'
                  className='form-radio'
                  onChange={() => dispatch(toggleNavbar('navbar-floating'))}
                />
                <span>Floating</span>
              </label>
              <label className='mb-0 inline-flex'>
                <input
                  type='radio'
                  checked={themeConfig.navbar === 'navbar-static'}
                  value='navbar-static'
                  className='form-radio'
                  onChange={() => dispatch(toggleNavbar('navbar-static'))}
                />
                <span>Static</span>
              </label>
            </div>
          </div>

          {/* Router Transition Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Router Transition
            </h5>
            <p className='text-white-dark text-xs'>
              Animation of main content.
            </p>
            <div className='mt-3'>
              <select
                className='form-select border-primary text-primary'
                value={themeConfig.animation}
                onChange={e => dispatch(toggleAnimation(e.target.value))}
              >
                <option value=' '>None</option>
                <option value='animate__fadeIn'>Fade</option>
                <option value='animate__fadeInDown'>Fade Down</option>
                <option value='animate__fadeInUp'>Fade Up</option>
                <option value='animate__fadeInLeft'>Fade Left</option>
                <option value='animate__fadeInRight'>Fade Right</option>
                <option value='animate__slideInDown'>Slide Down</option>
                <option value='animate__slideInLeft'>Slide Left</option>
                <option value='animate__slideInRight'>Slide Right</option>
                <option value='animate__zoomIn'>Zoom In</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
