import React from 'react';

import '@/styles/landing-page.css';

import FeaturesSection from '@/components/landing-page/FeaturesSection';
import Footer from '@/components/landing-page/Footer';
import Header from '@/components/landing-page/Header';
import HeroSection from '@/components/landing-page/HeroSection';
import HowItWorksSection from '@/components/landing-page/HowItWorks';

export default function LandingPage() {
  return (
    <main className='overflow-x-hidden scroll-smooth bg-white text-[#030303] transition-colors  duration-500 dark:bg-gradient-to-r dark:from-[#0a2540] dark:to-[#0a2540] dark:text-white'>
      <Header />
      <div className='mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20'>
        <section id='hero' className='w-full scroll-mt-32 pt-20'>
          <HeroSection />
        </section>

        <section id='features' className='scroll-mt-20'>
          <FeaturesSection />
        </section>

        <section id='how' className='scroll-mt-20'>
          <HowItWorksSection />
        </section>
      </div>
      <Footer />
    </main>
  );
}
