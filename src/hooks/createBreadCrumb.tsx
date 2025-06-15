import Link from 'next/link';

import { getTranslation } from '@/lib/lang/i18n';
const { t } = getTranslation();

const capitalizeWords = (str: string) =>
  str
    .replaceAll('_', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const CreateBreadCrumb = ({ pathname }: { pathname: string }) => {
  const listPathName = pathname.split('/').filter(item => item);
  const listPathWithoutSlash = listPathName.map((item, index) => {
    return {
      name: capitalizeWords(t(item)),
      path: '/' + listPathName.slice(0, index + 1).join('/'),
    };
  });

  return (
    <>
      <ul className='flex space-x-2 rtl:space-x-reverse'>
        <Link
          href='/'
          className='text-primary hover:underline ltr:before:mr-2 rtl:before:ml-2 '
        >
          Home
        </Link>
        {listPathWithoutSlash.map((item, index) => {
          return (
            <>
              {index === listPathName.length - 1 ? (
                <li
                  className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"
                  key={index}
                >
                  <span>{t(item.name)}</span>
                </li>
              ) : (
                <li key={index} className='flex'>
                  /
                  <p className='ltr:before:mr-2 rtl:before:ml-2'>
                    {t(item.name)}
                  </p>
                </li>
              )}
            </>
          );
        })}
      </ul>
    </>
  );
};

export default CreateBreadCrumb;
