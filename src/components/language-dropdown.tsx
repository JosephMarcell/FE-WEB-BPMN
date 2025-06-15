'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';

import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';

import { IRootState } from '@/store';
import { toggleRTL } from '@/store/themeConfigSlice';

interface LanguageDropdownProps {
  className?: string;
}

interface Language {
  code: string;
  name: string;
}

const LanguageDropdown = ({ className = '' }: LanguageDropdownProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { i18n } = getTranslation();

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

  return (
    <div className={`dropdown ${className}`}>
      {i18n.language && (
        <Dropdown
          offset={[0, 8]}
          placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
          btnClassName='flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black'
          button={
            <>
              <div>
                <Image
                  src={`/assets/images/flags/${i18n.language.toUpperCase()}.svg`}
                  alt='image'
                  className='h-5 w-5 rounded-full object-cover'
                  width={20}
                  height={20}
                />
              </div>
              <div className='text-base font-bold uppercase'>
                {i18n.language}
              </div>
              <span className='shrink-0'>
                <IconCaretDown />
              </span>
            </>
          }
        >
          <ul className='text-dark dark:text-white-dark dark:text-white-light/90 grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold'>
            {themeConfig.languageList.map((item: Language) => (
              <li key={item.code}>
                <button
                  type='button'
                  className={`hover:text-primary flex w-full rounded-lg ${
                    i18n.language === item.code
                      ? 'bg-primary/10 text-primary'
                      : ''
                  }`}
                  onClick={() => {
                    i18n.changeLanguage(item.code);
                    setLocale(item.code);
                  }}
                >
                  <Image
                    src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                    alt='flag'
                    className='h-5 w-5 rounded-full object-cover'
                    width={20}
                    height={20}
                  />
                  <span className='ltr:ml-3 rtl:mr-3'>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </Dropdown>
      )}
    </div>
  );
};

export default LanguageDropdown;
