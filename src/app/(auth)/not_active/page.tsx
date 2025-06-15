import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import ComponentsNotActive from '@/components/auth/components-not-active';

export const metadata: Metadata = {
  title: 'Not Active',
};

export default function NotActive() {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <ComponentsNotActive />
        </div>
      </section>
    </main>
  );
}
