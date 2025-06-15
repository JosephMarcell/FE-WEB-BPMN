import Link from 'next/link';
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

import {
  getAllViolationsProps,
  getSeverityClass,
  getStatusClass,
} from '@/helpers/utils/violations/violation';

const CardViolation: React.FC<getAllViolationsProps> = ({
  pkid,
  latitude,
  longitude,
  status,
  severity,
  violation_type,
  description,
}) => {
  const statusClass = getStatusClass(status);
  const severityClass = getSeverityClass(severity);
  return (
    <div className='flex h-full w-full flex-col rounded-lg bg-[#F4F4F4] p-3 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <FaMapMarkerAlt />
          <span>
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <button className={`rounded-lg px-3 py-1 ${severityClass}`}>
            {severity}
          </button>
          <button className={`rounded-lg px-3 py-1 ${statusClass}`}>
            {status}
          </button>
        </div>
      </div>
      <h3 className='mb-2 text-lg font-semibold'>{violation_type}</h3>
      <p className='mb-4 line-clamp-4 flex-grow text-sm text-gray-700'>
        {description}
      </p>
      <Link href={`/violations/${pkid}`}>
        <button type='button' className='btn btn-primary mt-auto w-full'>
          Detail
        </button>
      </Link>
    </div>
  );
};

export default CardViolation;
