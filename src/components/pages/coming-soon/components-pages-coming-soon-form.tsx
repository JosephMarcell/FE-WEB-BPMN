'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import IconFacebookCircle from '@/components/icon/icon-facebook-circle';
import IconGoogle from '@/components/icon/icon-google';
import IconInstagram from '@/components/icon/icon-instagram';
import IconTwitter from '@/components/icon/icon-twitter';

interface TimerState {
  days: number | null;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

const ComponentsPagesComingSoonForm = () => {
  const [demo1, setDemo1] = useState<TimerState>({
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  });

  const [timer1, setTimer1] = useState<NodeJS.Timeout | null>(null);

  const setTimerDemo1 = useCallback(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const countDownDate = date.getTime();

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const updatedValue: Partial<TimerState> = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };

      setDemo1(prevDemo => ({ ...prevDemo, ...updatedValue }));

      if (distance < 0 && timer1) {
        clearInterval(timer1);
      }
    }, 1000);
    setTimer1(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, [setDemo1, timer1]);

  useEffect(() => {
    const clearTimer = setTimerDemo1();

    return () => {
      clearTimer();
      if (timer1) clearInterval(timer1);
    };
  }, [setTimerDemo1, timer1]);

  const router = useRouter();

  return (
    <>
      <div className='text-primary mb-16 flex items-center justify-center gap-2 text-xl font-bold leading-none sm:text-2xl md:mb-24 md:gap-4 md:text-[50px]'>
        <div className='bg-primary-light relative inline-flex h-12 w-14 items-center justify-center rounded-md p-2 sm:h-16 sm:w-16 md:h-24 md:min-w-[120px]'>
          <div className='absolute inset-1 flex flex-col gap-1'>
            <span className='bg-primary/[12%] h-full w-full rounded-md'></span>
            <span className='h-full w-full rounded-md bg-white'></span>
          </div>
          <span className='relative'>{demo1.days}</span>
        </div>
        <span>:</span>
        <div className='bg-primary-light relative inline-flex h-12 w-12 items-center justify-center rounded-md p-2 sm:h-16 sm:w-16 md:h-24 md:min-w-[96px]'>
          <div className='absolute inset-1 flex flex-col gap-1'>
            <span className='bg-primary/[12%] h-full w-full rounded-md'></span>
            <span className='h-full w-full rounded-md bg-white'></span>
          </div>
          <span className='relative'>{demo1.hours}</span>
        </div>
        <span>:</span>
        <div className='bg-primary-light relative inline-flex h-12 w-12 items-center justify-center rounded-md p-2 sm:h-16 sm:w-16 md:h-24 md:min-w-[96px]'>
          <div className='absolute inset-1 flex flex-col gap-1'>
            <span className='bg-primary/[12%] h-full w-full rounded-md'></span>
            <span className='h-full w-full rounded-md bg-white'></span>
          </div>
          <span className='relative'>{demo1.minutes}</span>
        </div>
        <span>:</span>
        <div className='bg-primary-light relative inline-flex h-12 w-12 items-center justify-center rounded-md p-2 sm:h-16 sm:w-16 md:h-24 md:min-w-[96px]'>
          <div className='absolute inset-1 flex flex-col gap-1'>
            <span className='bg-primary/[12%] h-full w-full rounded-md'></span>
            <span className='h-full w-full rounded-md bg-white'></span>
          </div>
          <span className='relative'>{demo1.seconds}</span>
        </div>
      </div>
      <div className='mb-20 md:mb-32'>
        <h2 className='text-lg font-bold uppercase sm:text-xl dark:text-white'>
          Subscribe to get notified!
        </h2>
        <div className='relative mb-10 mt-8'>
          <input
            type='email'
            placeholder='mail@gmail.com'
            className='form-input placeholder:text-white-dark mb-5 py-3.5 placeholder:text-base sm:mb-0 sm:pe-32'
          />
          <button
            type='button'
            className='btn btn-gradient end-1.5 top-1/2 inline-flex border-0 px-4 py-1.5 text-base shadow-none sm:absolute sm:-translate-y-1/2'
            onClick={() => router.push('/')}
          >
            Subscribe
          </button>
        </div>
        <ul className='flex justify-center gap-3.5 text-white'>
          <li>
            <Link
              href='#'
              className='inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
              }}
            >
              <IconInstagram />
            </Link>
          </li>
          <li>
            <Link
              href='#'
              className='inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
              }}
            >
              <IconFacebookCircle />
            </Link>
          </li>
          <li>
            <Link
              href='#'
              className='inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
              }}
            >
              <IconTwitter fill={true} />
            </Link>
          </li>
          <li>
            <Link
              href='#'
              className='inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
              }}
            >
              <IconGoogle />
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ComponentsPagesComingSoonForm;
