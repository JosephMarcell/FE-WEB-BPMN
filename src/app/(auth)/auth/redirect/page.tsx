import { Metadata } from 'next';
import * as React from 'react';

import ComponentsRedirect from '@/components/auth/components-redirect';

export const metadata: Metadata = {
  title: 'Log in',
};

export default function Redirect() {
  return (
    <main>
      <section className='bg-white'>
        <ComponentsRedirect />
      </section>
    </main>
  );
}
