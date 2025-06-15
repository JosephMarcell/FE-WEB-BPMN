import React from 'react';

const Tooltip = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <div className='group relative'>
      {children}
      <div className='absolute left-full top-1/2 z-10 ml-2 hidden -translate-y-1/2 transform rounded bg-gray-700 px-2 py-1 text-xs text-white shadow-lg group-hover:block'>
        {label}
      </div>
    </div>
  );
};

export default Tooltip;
