'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Add this
import { useEffect, useState } from 'react'; // Add useEffect
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import ComponentsAuthLoginForm from './components-auth-login-form';

const LoginCard = () => {
  const { t, i18n } = getTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isDarkMode] = useState(false);

  // Add session expired check
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired');

  useEffect(() => {
    // Hanya tampilkan popup session expired dengan kondisi yang lebih ketat:
    // 1. Parameter query ada
    // 2. Notifikasi belum ditampilkan
    // 3. Ada flag bahwa sebelumnya pengguna pernah login
    const hadPreviousSession =
      localStorage.getItem('hadAuthSession') === 'true';

    if (
      sessionExpired === 'true' &&
      !localStorage.getItem('sessionExpiredShown') &&
      hadPreviousSession
    ) {
      Swal.fire({
        title: t('info'),
        text: t('session_expired'),
        icon: 'info',
      });

      // Tandai bahwa notifikasi sudah ditampilkan
      localStorage.setItem('sessionExpiredShown', 'true');

      // Hapus parameter sessionExpired dari URL untuk mencegah popup muncul lagi saat refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionExpired');
      window.history.replaceState({}, '', url);
    }
  }, [sessionExpired, t]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    window.location.reload();
  };

  return (
    <div className='relative z-10 w-full max-w-md'>
      {/* Logo positioned above the card */}
      <div className='absolute -top-20 left-0 right-0 z-10 flex justify-center'>
        <div className='mt-8 rounded-full border bg-white p-2 shadow-xl dark:border-[#415a77] dark:bg-[#0d1b2a]'>
          <Image
            src='/assets/images/lecsens-logo.png'
            alt='LecSens Logo'
            width={230}
            height={230}
            priority
            className='object-contain'
          />
        </div>
      </div>

      {/* Main card */}
      <div className='overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-sm transition-colors dark:border-[#415a77]/50 dark:bg-[#1b263b]/95'>
        {/* Decorative top accent */}
        <div className='h-2 bg-gradient-to-r from-[#0078C1] to-[#00a1ff]'></div>

        {/* Content area */}
        <div className='p-8 pt-14'>
          {/* Language selector dropdown
          <div className="absolute right-4 top-4">
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
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
                <span className='text-xs font-medium'>{i18n.language.toUpperCase()}</span>
              </button>
              
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 top-full mt-1 w-24 overflow-hidden rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg z-50`}
                    onClick={(e) => e.stopPropagation()}
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
                          : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <Image
                        src="/assets/images/flags/EN.svg"
                        alt="English"
                        width={20}
                        height={20}
                        className="h-4 w-4 rounded-full"
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
                          : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      <Image
                        src="/assets/images/flags/INA.svg"
                        alt="Indonesia"
                        width={20}
                        height={20}
                        className="h-4 w-4 rounded-full"
                      />
                      <span>Indonesia</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div> */}

          <h1 className='mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white'>
            {t('sign_in_to_lecsens')}
          </h1>

          {/* Login form component */}
          <ComponentsAuthLoginForm />

          {/* Signup link */}
          <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
            {t('no_account')}&nbsp;
            <Link
              href='/auth/signup'
              className='font-medium text-[#0078C1] transition-colors hover:text-[#00a1ff]'
            >
              {t('sign_up')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
