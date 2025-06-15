import Image from 'next/image';
import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarShapes = () => {
  return (
    <PanelCodeHighlight
      title='Shapes'
      codeHighlight={`
<span className="w-20 h-20 relative rounded-md overflow-hidden">
  <Image src="/assets/images/profile-12.jpeg" alt="img" layout="fill" objectFit="cover" />
</span>

<span className="w-16 h-16 relative rounded-full overflow-hidden">
  <Image src="/assets/images/profile-12.jpeg" alt="img" layout="fill" objectFit="cover" />
</span>

<span className="w-14 h-14 relative rounded-md overflow-hidden">
  <Image src="/assets/images/profile-12.jpeg" alt="img" layout="fill" objectFit="cover" />
</span>

<span className="w-10 h-10 relative overflow-hidden">
  <Image src="/assets/images/profile-12.jpeg" alt="img" layout="fill" objectFit="cover" />
</span>
`}
    >
      <div className='mb-5'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <span className='relative h-20 w-20 overflow-hidden rounded-md'>
            <Image
              src='/assets/images/profile-12.jpeg'
              alt='img'
              layout='fill'
              objectFit='cover'
            />
          </span>
          <span className='relative h-16 w-16 overflow-hidden rounded-full'>
            <Image
              src='/assets/images/profile-12.jpeg'
              alt='img'
              layout='fill'
              objectFit='cover'
            />
          </span>
          <span className='relative h-14 w-14 overflow-hidden rounded-md'>
            <Image
              src='/assets/images/profile-12.jpeg'
              alt='img'
              layout='fill'
              objectFit='cover'
            />
          </span>
          <span className='relative h-10 w-10 overflow-hidden'>
            <Image
              src='/assets/images/profile-12.jpeg'
              alt='img'
              layout='fill'
              objectFit='cover'
            />
          </span>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarShapes;
