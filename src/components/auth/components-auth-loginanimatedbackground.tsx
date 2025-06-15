'use client';

import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
      {/* Animated background elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        {/* Water-like grid pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMCAwaDYwdjYwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMEg2MFY2MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA3OEMxIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMSwyIi8+PC9zdmc+')]"></div>
        </div>

        {/* Water bubble elements */}
        <div className='animate-water-bubble absolute -left-20 top-1/4 h-40 w-40 rounded-full bg-[#0078C1] opacity-20'></div>
        <div className='animate-water-bubble animation-delay-2000 absolute -right-10 bottom-1/3 h-56 w-56 rounded-full bg-[#0078C1] opacity-15'></div>
        <div className='animate-water-bubble animation-delay-3500 absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-[#00a1ff] opacity-20'></div>

        {/* Additional water elements */}
        <div className='top-1/5 animate-water-bubble animation-delay-1000 absolute left-1/4 h-48 w-48 rounded-full bg-[#00a1ff] opacity-15'></div>
        <div className='animate-water-bubble animation-delay-4500 absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-[#0078C1] opacity-10'></div>
        <div className='animate-water-bubble animation-delay-3000 absolute left-1/3 top-3/4 h-24 w-24 rounded-full bg-[#00a1ff] opacity-25'></div>

        {/* Water surface ripple effect */}
        <div className='animate-ripple absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#0078C1]/20 to-transparent opacity-30'></div>
      </div>

      <style jsx>{`
        @keyframes water-bubble {
          0%,
          100% {
            transform: translateY(0) scale(0.95);
            opacity: 0.15;
            border-radius: 60% 40% 50% 50%;
          }
          50% {
            transform: translateY(-30px) scale(1.05);
            opacity: 0.25;
            border-radius: 50% 60% 40% 50%;
          }
        }

        @keyframes ripple {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) scaleX(1.02);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
        }

        .animate-water-bubble {
          animation: water-bubble 8s ease-in-out infinite;
          will-change: transform, opacity, border-radius;
          filter: blur(1px);
        }

        .animate-ripple {
          animation: ripple 12s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
        .animation-delay-4500 {
          animation-delay: 4.5s;
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
