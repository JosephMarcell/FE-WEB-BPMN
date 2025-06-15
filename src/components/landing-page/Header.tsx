'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';

import { IRootState } from '@/store';
import { toggleTheme } from '@/store/themeConfigSlice';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // State baru untuk dropdown bahasa
  const dispatch = useDispatch();
  const isDarkMode = useSelector(
    (state: IRootState) => state.themeConfig.isDarkMode,
  );

  const { t, i18n } = getTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme(isDarkMode ? 'light' : 'dark'));
  };

  const navItems = ['hero', 'features', 'how'];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? 'bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 py-2 shadow-md backdrop-blur-sm'
            : 'bg-gradient-to-r from-white via-white to-[#E6F4FB] py-2 shadow-md backdrop-blur-sm'
          : isDarkMode
          ? 'bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 py-4'
          : 'bg-gradient-to-r from-white via-white to-[#E6F4FB] py-4'
      }`}
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center'
        >
          <Link href='/' className='flex items-center'>
            <Image
              src={
                isDarkMode
                  ? '/assets/images/lecsens-logo.png'
                  : '/assets/images/lecsens-logo.png'
              }
              alt='LecSens Logo'
              width={120}
              height={40}
              className='h-8 w-auto'
            />
            <span
              className={`ml-2 rounded-full px-2 py-1 text-xs ${
                isDarkMode
                  ? 'bg-[#00a1ff] text-gray-900'
                  : 'bg-[#0078C1] text-white'
              }`}
            >
              IoT
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className='hidden gap-8 md:flex'>
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item}`}
              className={`group relative text-sm font-medium ${
                isDarkMode
                  ? 'text-gray-300 hover:text-[#00a1ff]'
                  : 'text-gray-700 hover:text-[#0078C1]'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              {t(item)}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                  isDarkMode ? 'bg-[#00a1ff]' : 'bg-[#0078C1]'
                }`}
              ></span>
            </motion.a>
          ))}
        </nav>

        {/* Buttons + Mobile Menu Toggle */}
        <motion.div
          className='flex items-center gap-4'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='hidden items-center gap-4 sm:flex'>
            {/* Dropdown Language Selector - Dipindahkan setelah tombol register */}
            <div className='relative'>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className={`flex items-center rounded-full px-2 py-1 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors duration-300`}
              >
                <Image
                  src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`}
                  alt='language'
                  width={20}
                  height={20}
                  className='mr-1 h-4 w-4 rounded-full'
                />
                <span className='text-xs font-medium'>
                  {i18n.language.toUpperCase()}
                </span>
              </button>

              {/* Dropdown yang muncul saat diklik */}
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-1 w-24 overflow-hidden rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } z-50 shadow-lg`}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 p-2 text-sm ${
                        i18n.language === 'en'
                          ? isDarkMode
                            ? 'bg-gray-700 text-[#00a1ff]'
                            : 'bg-gray-100 text-[#0078C1]'
                          : isDarkMode
                          ? 'text-gray-300'
                          : 'text-gray-800'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <Image
                        src='/assets/images/flags/EN.svg'
                        alt='English'
                        width={20}
                        height={20}
                        className='h-4 w-4 rounded-full'
                      />
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ina');
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 p-2 text-sm ${
                        i18n.language === 'ina'
                          ? isDarkMode
                            ? 'bg-gray-700 text-[#00a1ff]'
                            : 'bg-gray-100 text-[#0078C1]'
                          : isDarkMode
                          ? 'text-gray-300'
                          : 'text-gray-800'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <Image
                        src='/assets/images/flags/INA.svg'
                        alt='Indonesia'
                        width={20}
                        height={20}
                        className='h-4 w-4 rounded-full'
                      />
                      <span>Indonesia</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className={`rounded-full p-2 ${
                isDarkMode
                  ? 'bg-gray-700 text-[#00a1ff] hover:bg-gray-600'
                  : 'bg-gray-100 text-[#0078C1] hover:bg-gray-200'
              } transition-colors duration-300`}
              aria-label={t('toggle_theme')}
            >
              {isDarkMode ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </button>

            <button
              className={`font-medium ${
                isDarkMode
                  ? 'text-[#00a1ff] hover:text-[#00b4ff]'
                  : 'text-[#0078C1] hover:text-[#005b96]'
              } transition-colors hover:underline`}
              onClick={() => {
                window.location.href = '/auth/login';
              }}
            >
              {t('login')}
            </button>
            <button
              className={`rounded-full px-4 py-2 transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? 'bg-[#00a1ff] text-gray-900 hover:bg-[#00b4ff]'
                  : 'bg-[#0078C1] text-white hover:bg-[#005b96]'
              } shadow-md`}
            >
              {t('register')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`rounded-full p-2 transition-colors md:hidden ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className='h-6 w-6'
                color={isDarkMode ? '#e5e7eb' : '#374151'}
              />
            ) : (
              <Menu
                className='h-6 w-6'
                color={isDarkMode ? '#e5e7eb' : '#374151'}
              />
            )}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`overflow-hidden rounded-b-xl shadow-lg md:hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='space-y-3 px-4 py-3'>
              {/* Language Selector for Mobile */}
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                    i18n.language === 'en'
                      ? isDarkMode
                        ? 'bg-gray-700 text-[#00a1ff]'
                        : 'bg-gray-100 text-[#0078C1]'
                      : 'border border-gray-300'
                  }`}
                >
                  <Image
                    src='/assets/images/flags/EN.svg'
                    alt='English'
                    width={20}
                    height={20}
                    className='h-5 w-5 rounded-full'
                  />
                  <span>EN</span>
                </button>

                <button
                  onClick={() => {
                    changeLanguage('ina');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                    i18n.language === 'ina'
                      ? isDarkMode
                        ? 'bg-gray-700 text-[#00a1ff]'
                        : 'bg-gray-100 text-[#0078C1]'
                      : 'border border-gray-300'
                  }`}
                >
                  <Image
                    src='/assets/images/flags/INA.svg'
                    alt='Indonesia'
                    width={20}
                    height={20}
                    className='h-5 w-5 rounded-full'
                  />
                  <span>INA</span>
                </button>
              </div>

              {/* Theme Toggle for Mobile */}
              <button
                onClick={() => {
                  handleThemeToggle();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                  isDarkMode
                    ? 'bg-gray-700 text-[#00a1ff]'
                    : 'bg-gray-100 text-[#0078C1]'
                } transition-colors`}
              >
                {isDarkMode ? (
                  <>
                    <Sun className='h-5 w-5' />
                    <span>{t('light_mode')}</span>
                  </>
                ) : (
                  <>
                    <Moon className='h-5 w-5' />
                    <span>{t('dark_mode')}</span>
                  </>
                )}
              </button>

              {/* Navigation Links */}
              {navItems.map(item => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-[#00a1ff]'
                      : 'text-gray-800 hover:bg-[#0078C1]/10 hover:text-[#0078C1]'
                  }`}
                >
                  {t(item)}
                </a>
              ))}

              {/* Login Button */}
              <button
                onClick={() => {
                  window.location.href = '/auth/login';
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full rounded-lg border px-4 py-3 text-center font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'border-[#00a1ff] text-[#00a1ff] hover:bg-gray-700'
                    : 'border-[#0078C1] text-[#0078C1] hover:bg-[#0078C1]/10'
                }`}
              >
                {t('login')}
              </button>

              {/* Register Button */}
              <button
                onClick={() => {
                  window.location.href = '/auth/signup';
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full rounded-lg px-4 py-3 text-center font-medium shadow-md transition-all duration-300 hover:shadow-lg ${
                  isDarkMode
                    ? 'bg-[#00a1ff] text-gray-900 hover:bg-[#00b4ff]'
                    : 'bg-[#0078C1] text-white hover:bg-[#005b96]'
                }`}
              >
                {t('register')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
