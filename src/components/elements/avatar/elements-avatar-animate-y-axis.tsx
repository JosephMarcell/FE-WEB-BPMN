import Image from 'next/image';
import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarAnimateYAxis = () => {
  return (
    <PanelCodeHighlight
      title='Animate Y-axis'
      codeHighlight={`<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
        width={48} 
        height={48}
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
        width={48} 
        height={48}
    />
    <img
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2"
        src="/assets/images/profile-12.jpeg"
        alt="img"
        width={48} 
        height={48}
    />
    <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark relative transition-all duration-300 hover:hover:translate-y-2">
        AG
    </span>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse'>
          <Image
            className='dark:ring-white-dark relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={48}
            height={48}
            layout='fixed'
          />
          <Image
            className='dark:ring-white-dark relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={48}
            height={48}
            layout='fixed'
          />
          <Image
            className='dark:ring-white-dark relative h-12 w-12 rounded-full object-cover ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={48}
            height={48}
            layout='fixed'
          />
          <span className='bg-info dark:ring-white-dark relative flex h-12 w-12 items-center justify-center rounded-full object-cover text-center text-base ring-2 ring-white transition-all duration-300 hover:hover:translate-y-2'>
            AG
          </span>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarAnimateYAxis;
