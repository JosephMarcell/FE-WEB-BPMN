import React from 'react';

import CardViolation from '@/components/apps/violations/components/card-violation';

import { ListViolationProps } from '@/helpers/utils/violations/violation';

const ListViolation: React.FC<ListViolationProps> = ({
  data,
  maxPage,
  page,
  onPageChange,
  isLoading,
  error,
}) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading violations</div>;
  return (
    <div className='panel mt-6'>
      <div className='mb-5 flex flex-col gap-5 px-5'>
        <h2 className='text-xl font-semibold'>List Pelanggaran</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {data.map((item, index) => (
            <CardViolation
              key={index}
              report_title={item.report_title}
              pkid={item.pkid}
              latitude={item.latitude}
              longitude={item.longitude}
              status={item.status}
              severity={item.severity}
              violation_type={item.violation_type}
              description={item.description}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className='mt-4 flex justify-center'>
          <button
            className='rounded-l-md bg-gray-300 px-4 py-2'
            onClick={() => onPageChange(1)}
            disabled={maxPage === 1}
          >
            First
          </button>
          <button
            className='bg-gray-300 px-4 py-2'
            onClick={() => onPageChange(Math.max(1, maxPage - 1))}
            disabled={maxPage === 1}
          >
            Prev
          </button>
          <span className='px-4 py-2'>{`Page ${page}`}</span>
          <button
            className='bg-gray-300 px-4 py-2'
            onClick={() => onPageChange(Math.min(maxPage + 1, maxPage))}
            disabled={maxPage === 1}
          >
            Next
          </button>
          <button
            className='rounded-r-md bg-gray-300 px-4 py-2'
            onClick={() => onPageChange(maxPage)}
            disabled={maxPage === 1}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListViolation;
