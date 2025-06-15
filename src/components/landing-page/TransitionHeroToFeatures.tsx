'use client';

import React from 'react';

const TransitionHeroToFeatures = () => {
  return (
    <div className='relative h-32 bg-white md:h-48'>
      {/* Gelombang SVG sebagai pemisah */}
      <svg
        className='absolute bottom-0 h-full w-full'
        viewBox='0 0 1440 320'
        preserveAspectRatio='none'
      >
        <path
          fill='#ffffff'
          d='M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,128C672,117,768,107,864,101.3C960,96,1056,96,1152,117.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
        ></path>
      </svg>
    </div>
  );
};

export default TransitionHeroToFeatures;
