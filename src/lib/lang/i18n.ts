import Cookies from 'universal-cookie';

import en from '../../../public/locales/en.json';
import ina from '../../../public/locales/ina.json';

type LocaleType = Record<string, string>;

const langObj: Record<string, LocaleType> = {
  en,
  ina,
};

const getLang = (): string => {
  if (typeof window !== 'undefined') {
    const cookies = new Cookies();
    return cookies.get('i18nextLng') || 'ina';
  }
  return 'ina';
};

export const getTranslation = () => {
  const lang = getLang();
  const data = langObj[lang] || langObj.ina;

  const t = (key: string): string => {
    return data[key] || key;
  };

  const initLocale = (themeLocale: string) => {
    const lang = getLang();
    i18n.changeLanguage(lang || themeLocale);
  };

  const i18n = {
    language: lang,
    changeLanguage: (lang: string) => {
      if (typeof window !== 'undefined') {
        const cookies = new Cookies();
        cookies.set('i18nextLng', lang, { path: '/' });
      }
    },
  };

  return { t, i18n, initLocale };
};
