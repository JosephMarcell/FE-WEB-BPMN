'use client';

import React, { useEffect, useState } from 'react';

import { useGetCoaByPkid } from '@/app/api/hooks/general_ledger/coa/useGetCoaByPkid';
import { BankAccount } from '@/helpers/utils/cash_bank/bank_account';

interface IBankAccountDetail {
  data: BankAccount;
}

const formatCurrencyDisplay = (value: number, currencyCode: string): string => {
  if (isNaN(value)) return '';
  return `${currencyCode} ${value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDateDisplay = (date: Date | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const BankAccountDetailComponent = ({ data }: IBankAccountDetail) => {
  const {
    code,
    currency_code,
    coa_id,
    bank_name,
    bank_code,
    bank_country,
    branch_name,
    account_number,
    account_name,
    account_type,
    balance,
    status,
    created_by,
    created_date,
    description,
  } = data;

  const { data: coaDetail } = useGetCoaByPkid(Number(coa_id), !!coa_id);
  const [coaPkid, setCoaPkid] = useState<string>('');
  const [coaName, setCoaName] = useState<string>('');
  const [coaNumber, setCoaNumber] = useState<string>('');

  useEffect(() => {
    if (coaDetail) {
      setCoaPkid(coaDetail.pkid.toString());
      setCoaName(coaDetail.name);
      setCoaNumber(coaDetail.number);
    }
  }, [coaDetail]);

  const getStatusClass = (status: string) => {
    return status === 'active' ? 'bg-green-100' : 'bg-gray-100';
  };

  return (
    <div className='panel border-white-light h-full px-0 pb-10'>
      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>General Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='code'>Account Code</label>
            <input
              id='code'
              name='code'
              type='text'
              placeholder='Account Code'
              className='form-input w-full'
              value={code || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='currency_code'>Currency Code</label>
            <input
              id='currency_code'
              name='currency_code'
              type='text'
              placeholder='Currency Code'
              className='form-input w-full'
              value={currency_code || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='coa_pkid'>COA ID</label>
            <input
              id='coa_pkid'
              name='coa_pkid'
              type='text'
              placeholder='COA ID'
              className='form-input w-full'
              value={coaPkid || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='coa_name'>COA Name</label>
            <input
              id='coa_name'
              name='coa_name'
              type='text'
              placeholder='COA Name'
              className='form-input w-full'
              value={coaName || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='coa_number'>COA Number</label>
            <input
              id='coa_number'
              name='coa_number'
              type='text'
              placeholder='COA Number'
              className='form-input w-full'
              value={coaNumber || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Account Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='account_number'>Account Number</label>
            <input
              id='account_number'
              name='account_number'
              type='text'
              placeholder='Account Number'
              className='form-input w-full'
              value={account_number || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='account_name'>Account Name</label>
            <input
              id='account_name'
              name='account_name'
              type='text'
              placeholder='Account Name'
              className='form-input w-full'
              value={account_name || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='account_type'>Account Type</label>
            <input
              id='account_type'
              name='account_type'
              type='text'
              placeholder='Account Type'
              className='form-input w-full'
              value={account_type || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='balance'>Balance</label>
            <input
              id='balance'
              name='balance'
              type='text'
              placeholder='Balance'
              className='form-input w-full'
              value={formatCurrencyDisplay(Number(balance), currency_code)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='bank_name'>Bank Name</label>
            <input
              id='bank_name'
              name='bank_name'
              type='text'
              placeholder='Bank Name'
              className='form-input w-full'
              value={bank_name || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='bank_code'>Bank Code</label>
            <input
              id='bank_code'
              name='bank_code'
              type='text'
              placeholder='Bank Code'
              className='form-input w-full'
              value={bank_code || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='bank_country'>Bank Country</label>
            <input
              id='bank_country'
              name='bank_country'
              type='text'
              placeholder='Bank Country'
              className='form-input w-full'
              value={bank_country || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='branch_name'>Branch Name</label>
            <input
              id='branch_name'
              name='branch_name'
              type='text'
              placeholder='Branch Name'
              className='form-input w-full'
              value={branch_name || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Additional Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='status'>Status</label>
            <input
              id='status'
              name='status'
              type='text'
              placeholder='Status'
              className={`form-input w-full ${getStatusClass(status)}`}
              value={status || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
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
              value={formatDateDisplay(new Date(created_date))}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='flex flex-col gap-5'>
          <div className='w-full'>
            <label htmlFor='description'>Description</label>
            <input
              id='description'
              name='description'
              type='text'
              placeholder='Description'
              className='form-input w-full'
              value={description || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountDetailComponent;
