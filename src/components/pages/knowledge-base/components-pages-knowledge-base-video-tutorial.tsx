'use client';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';

import IconPlayCircle from '@/components/icon/icon-play-circle';
import IconX from '@/components/icon/icon-x';

interface VideoItem {
  src: string;
  title: string;
}

const ComponentsPagesKnowledgeBaseVideoTutorial = () => {
  const [modal, setModal] = useState(false);
  const items: VideoItem[] = [
    {
      src: '/assets/images/knowledge/image-5.jpg',
      title: 'Excessive sugar is harmful',
    },
    {
      src: '/assets/images/knowledge/image-6.jpg',
      title: 'Creative Photography',
    },
    {
      src: '/assets/images/knowledge/image-7.jpg',
      title: 'Plan your next trip',
    },
    {
      src: '/assets/images/knowledge/image-8.jpg',
      title: 'My latest Vlog',
    },
  ];

  return (
    <div className='mt-10 lg:mt-16'>
      <h3 className='mb-6 text-xl font-bold md:text-3xl'>
        Popular Video Tutorial
      </h3>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {items.map(item => (
          <div
            key={item.title}
            className='border-white-light space-y-5 rounded-md border bg-white p-5 shadow-[0px_0px_2px_0px_rgba(145,158,171,0.20),0px_12px_24px_-4px_rgba(145,158,171,0.12)] dark:border-[#1B2E4B] dark:bg-black'
          >
            <div className='group relative h-[340px] overflow-hidden rounded-md'>
              <Image
                src={item.src}
                alt={item.title}
                layout='fill'
                objectFit='cover'
                className='cursor-pointer'
                onClick={() => setModal(true)}
              />
              <button
                type='button'
                className='absolute left-1/2 top-1/2 grid h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full text-white duration-300 group-hover:scale-110'
                onClick={() => setModal(true)}
              >
                <IconPlayCircle className='h-[62px] w-[62px]' fill={true} />
              </button>
              <div className='absolute bottom-0 left-0 w-full bg-white/30 px-5 py-[22px] text-center text-xl text-white backdrop-blur-[5px]'>
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Transition appear show={modal} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
          open={modal}
          onClose={() => setModal(false)}
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='my-8 w-full max-w-3xl overflow-hidden'>
                <div className='text-right'>
                  <button
                    onClick={() => setModal(false)}
                    type='button'
                    className='text-white-dark hover:text-dark !outline-none'
                  >
                    <IconX />
                  </button>
                </div>
                <iframe
                  title='youtube-video'
                  src='https://www.youtube.com/embed/tgbNymZ7vqY'
                  className='h-[250px] w-full md:h-[550px]'
                  allowFullScreen
                ></iframe>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
export default ComponentsPagesKnowledgeBaseVideoTutorial;
