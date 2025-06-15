'use client';
import Tippy from '@tippyjs/react';
import Image from 'next/image';
import React from 'react';

import 'tippy.js/dist/tippy.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarTooltip = () => {
  return (
    <PanelCodeHighlight
      title='Tooltip'
      codeHighlight={`
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Image from 'next/image';

<div className="flex items-center justify-center -space-x-4 rtl:space-x-reverse text-white">
    <Tippy content="Judy Holmes">
        <span className="w-12 h-12 relative rounded-full object-cover ring-2 ring-white dark:ring-white-dark">
            <Image src="/assets/images/profile-12.jpeg" alt="Judy Holmes" layout="fill" objectFit="cover" />
        </span>
    </Tippy>
    <Tippy content="Alan Green">
        <span className="flex justify-center items-center w-12 h-12 text-center rounded-full object-cover bg-info text-base ring-2 ring-white dark:ring-white-dark">AG</span>
    </Tippy>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex items-center justify-center -space-x-4 text-white rtl:space-x-reverse'>
          <Tippy content='Judy Holmes'>
            <span className='dark:ring-white-dark relative h-12 w-12 rounded-full ring-2 ring-white'>
              <Image
                src='/assets/images/profile-12.jpeg'
                alt='Judy Holmes'
                layout='fill'
                objectFit='cover'
              />
            </span>
          </Tippy>
          <Tippy content='Alan Green'>
            <span className='bg-info dark:ring-white-dark flex h-12 w-12 items-center justify-center rounded-full text-center text-base ring-2 ring-white'>
              AG
            </span>
          </Tippy>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarTooltip;
