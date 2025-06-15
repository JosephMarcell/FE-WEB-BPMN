import Image from 'next/image';
import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarGroup = () => {
  return (
    <PanelCodeHighlight
      title='Group'
      codeHighlight={`
<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <Image className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={64} height={64} />
    <Image className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={64} height={64} />
    <Image className="w-16 h-16 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={64} height={64} />
    <span className="flex justify-center items-center w-16 h-16 text-center rounded-full object-cover bg-info text-xl ring-2 ring-white dark:ring-white-dark">AG</span>
</div>
<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <Image className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={48} height={48} />
    <Image className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={48} height={48} />
    <Image className="w-12 h-12 rounded-full overflow-hidden object-cover ring-2 ring-white dark:ring-white-dark" src="/assets/images/profile-12.jpeg" alt="img" width={48} height={48} />
    <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark">AG</span>
</div>`}
    >
      <div className='mb-5 flex flex-wrap items-center justify-around gap-10'>
        <div className='flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse'>
          {/* Replace each img with Image from next/image */}
          {[...Array(3)].map((_, index) => (
            <Image
              key={index}
              className='dark:ring-white-dark rounded-full object-cover ring-2 ring-white'
              src='/assets/images/profile-12.jpeg'
              alt='img'
              width={64}
              height={64}
              layout='fixed'
            />
          ))}
          <span className='bg-info dark:ring-white-dark flex h-16 w-16 items-center justify-center rounded-full object-cover text-center text-xl ring-2 ring-white'>
            AG
          </span>
        </div>
        <div className='flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse'>
          {[...Array(3)].map((_, index) => (
            <Image
              key={index}
              className='dark:ring-white-dark rounded-full object-cover ring-2 ring-white'
              src='/assets/images/profile-12.jpeg'
              alt='img'
              width={48}
              height={48}
              layout='fixed'
            />
          ))}
          <span className='bg-info dark:ring-white-dark flex h-12 w-12 items-center justify-center rounded-full object-cover text-center text-base ring-2 ring-white'>
            AG
          </span>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarGroup;
