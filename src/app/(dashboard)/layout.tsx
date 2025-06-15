'use client';

import React, { useState } from 'react';

import 'leaflet/dist/leaflet.css';

import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import Sidebar from '@/components/layouts/sidebar';
import Portals from '@/components/portals';

import { HighlightProvider } from '@/context/HighlightContext';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <HighlightProvider>
      <div className='relative'>
        <Overlay />
        <ScrollToTop />

        <MainContainer>
          <Sidebar setShowModal={setShowModal} />
          <div className='main-content flex min-h-screen flex-col'>
            <Header />
            <ContentAnimation>{children}</ContentAnimation>
            <Footer />
            <Portals />
          </div>
        </MainContainer>

        <Setting showModal={showModal} setShowModal={setShowModal} />
      </div>
    </HighlightProvider>
  );
}
