import { FC } from 'react';

interface IconMoneyReceiveProps {
  className?: string;
}

const IconMoneyReceive: FC<IconMoneyReceiveProps> = ({ className }) => {
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

      {/* Inner elements that may represent the 'receive' feature */}
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

      {/* Iconic representation of receiving/movement, flipped vertically */}
      <path
        d='M8 16l-4-4 4-4m-4 4h11'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeOpacity='0.5'
      />
    </svg>
  );
};

export default IconMoneyReceive;
