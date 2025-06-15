import Link from 'next/link';
import { FunctionComponent } from 'react';

interface CardMenuProps {
  title: string;
  description: string;
  icon: FunctionComponent<{ className?: string }>;
  path: string;
}

const CardMenu = ({ title, description, icon, path }: CardMenuProps) => {
  return (
    <Link href={path}>
      <div className='mb-5 flex items-center justify-center'>
        <div className='border-white-light group w-full rounded border bg-white from-cyan-500 to-blue-500  shadow-[4px_6px_10px_-3px_#bfc9d4] transition duration-1000 hover:bg-gradient-to-r dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none'>
          <div className='flex flex-col items-center justify-between p-5 group-hover:translate-y-[-30%] sm:flex-row'>
            <div className='flex-1 text-center sm:text-left ltr:sm:pl-5 rtl:sm:pr-5'>
              <div className='mb-2 flex justify-center group-hover:opacity-0 '>
                {icon({ className: 'w-10 h-10 text-primary' })}
              </div>
              <h5 className='dark:text-white-light text-center text-[18px] font-semibold  text-[#3b3f5c]'>
                {title}
              </h5>
              <div className='mt-2 text-center opacity-0 group-hover:opacity-100'>
                <p className='dark:text-white-light text-white'>
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardMenu;
