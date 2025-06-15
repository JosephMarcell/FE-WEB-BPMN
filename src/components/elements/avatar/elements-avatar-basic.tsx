import Image from 'next/image';
import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAvatarBasic = () => {
  return (
    <PanelCodeHighlight
      title='Basic'
      codeHighlight={`
<Image className="w-20 h-20 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" width={80} height={80} />

<Image className="w-16 h-16 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" width={64} height={64} />

<Image className="w-14 h-14 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" width={56} height={56} />

<Image className="w-12 h-12 rounded-full overflow-hidden object-cover" src="/assets/images/profile-12.jpeg" alt="img" width={48} height={48} />
`}
    >
      <div className='mb-5'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Image
            className='rounded-full object-cover'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={80}
            height={80}
            layout='fixed'
          />
          <Image
            className='rounded-full object-cover'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={64}
            height={64}
            layout='fixed'
          />
          <Image
            className='rounded-full object-cover'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={56}
            height={56}
            layout='fixed'
          />
          <Image
            className='rounded-full object-cover'
            src='/assets/images/profile-12.jpeg'
            alt='img'
            width={48}
            height={48}
            layout='fixed'
          />
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAvatarBasic;
