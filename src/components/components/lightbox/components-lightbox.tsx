'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';

const getItems = [
  {
    id: '1',
    src: '/assets/images/lightbox1.jpg',
    description:
      'This is dummy caption. It has been placed here solely to demonstrate the look and feel of finished, typeset text.',
    title: 'Photo: Samuel Rohl',
  },
  {
    id: '2',
    src: '/assets/images/lightbox2.jpeg',
    description:
      'This is dummy caption. It has been placed here solely to demonstrate the look and feel of finished, typeset text.',
    title: 'Photo: Samuel Rohl',
  },
  {
    id: '3',
    src: '/assets/images/lightbox3.jpeg',
    description:
      "Dummy caption. It's Greek to you. Unless, of course, you're Greek, in which case, it really makes no sense.",
    title: 'Photo: Michael Hull',
  },
  {
    id: '4',
    src: '/assets/images/lightbox4.jpeg',
    description: 'This is dummy caption.',
    title: 'Photo: Folkert Gorter',
  },
  {
    id: '5',
    src: '/assets/images/lightbox5.jpeg',
    description:
      "It's a dummy caption. He who searches for meaning here will be sorely disappointed.",
    title: 'Photo: Thomas Lefebvre',
  },
  {
    id: '6',
    src: '/assets/images/lightbox6.jpeg',
    description:
      "It's a dummy caption. He who searches for meaning here will be sorely disappointed.",
    title: 'Photo: Thomas Lefebvre',
  },
];

const ComponentsLightbox = () => {
  const [value, setValue] = useState<string>('all controls');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const [tabs] = useState<string>('All controls');
  const [tabs1] = useState<string>('All controls');
  const [showToggle, setShowToggle] = React.useState(false);
  const [maxZoomPixelRatio, setMaxZoomPixelRatio] = React.useState(4);

  return (
    <div className='panel'>
      <h5 className='dark:text-white-light mb-5 text-lg font-semibold'>
        Lightbox
      </h5>
      <div className='mb-5'>
        <div className='mb-5 flex'>
          <div className='ltr:mr-4 rtl:ml-4'>
            <input
              type='radio'
              value='all controls'
              onChange={handleChange}
              name='allcontrols'
              className='form-radio mt-1.5'
              checked={value === 'all controls'}
            />
          </div>
          <div className='flex-1'>
            <h4 className='text-primary text-lg font-semibold'>All controls</h4>
            <p className='media-text'>
              Caption, slideshow, thumbnails and fullscreen buttons, tap to
              toggle controls
            </p>
          </div>
        </div>
        <div className='flex'>
          <div className='ltr:mr-4 rtl:ml-4'>
            <input
              type='radio'
              value='minimal'
              onChange={handleChange}
              name='allcontrols'
              className='form-radio mt-1.5'
              checked={value === 'minimal'}
            />
          </div>
          <div className='flex-1'>
            <h4 className='text-primary text-lg font-semibold'>Minimal</h4>
            <p className='media-text'>
              No caption, no slideshow, no thumbnails, no fullscreen, tap to
              close
            </p>
          </div>
        </div>
        {value === 'all controls' ? (
          <div className='mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {tabs === 'All controls' && (
              <>
                {getItems.map((item, index) => {
                  return (
                    <Link
                      href='#'
                      key={item.id}
                      className={`${
                        index === 3 ? 'md:col-span-2 md:row-span-2' : ''
                      }`}
                      onClick={() => {
                        setIsOpen(true);
                        setPhotoIndex(index);
                      }}
                    >
                      <Image
                        src={item.src}
                        alt='gallery'
                        data-fancybox='gallery'
                        className='h-full w-full rounded-md object-cover'
                        data-caption={item.title}
                        width={200}
                        height={200}
                      />
                    </Link>
                  );
                })}
              </>
            )}
            <Lightbox
              styles={{ container: { backgroundColor: 'rgba(0,0,0,0.6)' } }}
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={getItems}
              index={photoIndex}
              plugins={[Captions, Zoom]}
              captions={{ showToggle }}
              zoom={{ maxZoomPixelRatio }}
            />
          </div>
        ) : (
          <div className='mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {tabs1 === 'All controls' && (
              <>
                {getItems.map((item, index) => {
                  return (
                    <Link
                      href='#'
                      key={item.id}
                      className={`${
                        index === 3 ? 'md:col-span-2 md:row-span-2' : ''
                      }`}
                      onClick={() => {
                        setPhotoIndex(index);
                        setIsOpen(true);
                        setShowToggle(false);
                        setMaxZoomPixelRatio(1);
                      }}
                    >
                      <Image
                        src={item.src}
                        alt='gallery'
                        data-fancybox='gallery'
                        className='h-full w-full rounded-md object-cover'
                        data-caption={item.title}
                        width={200}
                        height={200}
                      />
                    </Link>
                  );
                })}
              </>
            )}
            <Lightbox
              styles={{ container: { backgroundColor: 'rgba(0,0,0,0.6)' } }}
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={getItems}
              index={photoIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentsLightbox;
