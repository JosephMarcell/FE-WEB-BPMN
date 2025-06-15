import { FC } from 'react';

interface IconDollarSignProps {
  className?: string;
}
// eslint-disable-next-line unused-imports/no-unused-vars
const IconDollarSign: FC<IconDollarSignProps> = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='text-warning h-6 w-6'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14 14.76V3.5a3.5 3.5 0 1 0-7 0v11.26A4.5 4.5 0 1 0 14 14.76z'></path>
    </svg>
  );
};

export default IconDollarSign;
