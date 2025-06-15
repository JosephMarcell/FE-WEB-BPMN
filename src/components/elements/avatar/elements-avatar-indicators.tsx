import Image from 'next/image';
import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarIndicators = () => {
  return (
    <PanelCodeHighlight
      title='Indicators'
      codeHighlight={`
<span className="relative w-20 h-20">
  <Image src="/assets/images/profile-12.jpeg" alt="Profile image" layout="fill" className="rounded-full object-cover" />
  <span className="absolute bottom-0 right-0 w-7 h-7 bg-danger rounded-full ring-2 ring-white"></span>
</span>

<span className="relative w-16 h-16">
  <Image src="/assets/images/profile-12.jpeg" alt="Profile image" layout="fill" className="rounded-full object-cover" />
  <span className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full ring-2 ring-white"></span>
</span>

<span className="relative w-14 h-14">
  <Image src="/assets/images/profile-12.jpeg" alt="Profile image" layout="fill" className="rounded-full object-cover" />
  <span className="absolute bottom-0 right-0 w-5 h-5 bg-info rounded-full ring-2 ring-white"></span>
</span>

<span className="relative w-12 h-12">
  <Image src="/assets/images/profile-12.jpeg" alt="Profile image" layout="fill" className="rounded-full object-cover" />
  <span className="absolute bottom-0 right-0 w-4 h-4 bg-warning rounded-full ring-2 ring-white"></span>
</span>
`}
    >
      <div className='mb-5'>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          {[
            { size: 20, color: 'bg-danger' },
            { size: 16, color: 'bg-success' },
            { size: 14, color: 'bg-info' },
            { size: 12, color: 'bg-warning' },
          ].map((avatar, index) => (
            <span
              key={index}
              className={`relative w-${avatar.size} h-${avatar.size}`}
            >
              <span className='relative block h-full w-full'>
                <Image
                  src='/assets/images/profile-12.jpeg'
                  alt='Profile image'
                  layout='fill'
                  className='rounded-full object-cover'
                />
              </span>
              <span
                className={`absolute bottom-0 right-0 w-${avatar.size / 5} h-${
                  avatar.size / 5
                } ${avatar.color} rounded-full ring-2 ring-white`}
              ></span>
            </span>
          ))}
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarIndicators;
