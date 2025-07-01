import React from 'react';

import '@/styles/landing-page.css';

import FAQ from '@/components/landing-page/FAQ';
import FeaturesSection from '@/components/landing-page/FeaturesSection';
import Footer from '@/components/landing-page/Footer';
import Header from '@/components/landing-page/Header';
import HeroSection from '@/components/landing-page/HeroSection';
import HowItWorksSection from '@/components/landing-page/HowItWorks';
import Pricing from '@/components/landing-page/Pricing';
import ToolsandAPI from '@/components/landing-page/ToolsandAPI';
import KeyBenefits from '@/components/landing-page/KeyBenefits';

export default function LandingPage() {
  return (
    <main className='overflow-x-hidden scroll-smooth bg-white text-[#030303] transition-colors  duration-500 dark:bg-gradient-to-r dark:from-darkmode dark:to-darkmode dark:text-white'>
      <Header />
      <div className='mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-1a6 2xl:px-20'>
        <section id='hero' className='w-full scroll-mt-32 pt-20'>
          <HeroSection />
        </section>
        <section>
          <KeyBenefits/>
        </section>
        <section id='features' className='scroll-mt-20'>
          <FeaturesSection />
        </section>

        <section id='how' className='scroll-mt-20'>
          <HowItWorksSection />
        </section>
        <section id='api'>
          <ToolsandAPI />
        </section>
        <section id='FAQ'> 
          <FAQ />
        </section>
      </div>
      <Footer />
    </main>
  );
}
