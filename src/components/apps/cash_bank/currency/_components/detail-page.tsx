'use client';

import React from 'react';

import { Currency } from '@/helpers/utils/cash_bank/currency';

interface ICurrencyDetail {
  data: Currency;
}

const CurrencyDetailComponent = ({ data }: ICurrencyDetail) => {
  const {
    code,
    name,
    symbol,
    created_by,
    created_date,
    created_host,
    updated_by,
    updated_date,
    updated_host,
  } = data;

  const formatDateDisplay = (date: string | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className='panel border-white-light h-full px-0 pb-10'>
      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Currency Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='code'>Currency Code</label>
            <input
              id='code'
              name='code'
              type='text'
              placeholder='Currency Code'
              className='form-input w-full'
              value={code || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='name'>Currency Name</label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Currency Name'
              className='form-input w-full'
              value={name || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='symbol'>Currency Symbol</label>
            <input
              id='symbol'
              name='symbol'
              type='text'
              placeholder='Currency Symbol'
              className='form-input w-full'
              value={symbol || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Audit Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='created_by'>Created By</label>
            <input
              id='created_by'
              name='created_by'
              type='text'
              placeholder='Created By'
              className='form-input w-full'
              value={created_by || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='created_date'>Created Date</label>
            <input
              id='created_date'
              name='created_date'
              type='text'
              placeholder='Created Date'
              className='form-input w-full'
              value={formatDateDisplay(created_date)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='created_host'>Created Host</label>
            <input
              id='created_host'
              name='created_host'
              type='text'
              placeholder='Created Host'
              className='form-input w-full'
              value={created_host || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='updated_by'>Updated By</label>
            <input
              id='updated_by'
              name='updated_by'
              type='text'
              placeholder='Updated By'
              className='form-input w-full'
              value={updated_by || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='updated_date'>Updated Date</label>
            <input
              id='updated_date'
              name='updated_date'
              type='text'
              placeholder='Updated Date'
              className='form-input w-full'
              value={formatDateDisplay(updated_date)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='updated_host'>Updated Host</label>
            <input
              id='updated_host'
              name='updated_host'
              type='text'
              placeholder='Updated Host'
              className='form-input w-full'
              value={updated_host || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetailComponent;
