import { FC } from 'react';

interface IconMoneySendProps {
  className?: string;
}

const IconMoneySend: FC<IconMoneySendProps> = ({ className }) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {/* Card/Main shape */}
      <rect
        x='1'
        y='1'
        width='22'
        height='22'
        stroke='currentColor'
        strokeWidth='1.5'
      />

      {/* Inner elements that may represent the 'send' feature */}
      <line
        x1='6'
        y1='12'
        x2='18'
        y2='12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeOpacity='0.5'
      />
      <line
        x1='8'
        y1='16'
        x2='14'
        y2='16'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeOpacity='0.5'
      />
      <line
        x1='10'
        y1='8'
        x2='12'
        y2='8'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeOpacity='0.5'
      />

      {/* Iconic representation of sending/movement */}
      <path
        d='M16 8l4 4-4 4m4-4H9'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeOpacity='0.5'
      />
    </svg>
  );
};

export default IconMoneySend;
