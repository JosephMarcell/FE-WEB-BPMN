'use client';

import React from 'react';

import {
  BankDisbursement,
  BankDisbursementDetailProperty,
} from '@/helpers/utils/cash_bank/bank_disbursement';

interface IBankDisbursementDetail {
  data: BankDisbursement;
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

const BankDisbursementDetailComponent = ({ data }: IBankDisbursementDetail) => {
  if (!data) {
    return <div>No data available</div>;
  }

  const {
    code,
    bank_account_code,
    reference_code,
    disbursement_date,
    disbursement_amount,
    payment_method,
    admin_fee,
    total,
    payment_type,
    payment_reference,
    additional_notes,
    created_by,
    created_date,
    details,
  } = data;

  return (
    <div className='panel border-white-light h-full px-0 pb-10'>
      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>General Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='code'>Disbursement Code</label>
            <input
              id='code'
              name='code'
              type='text'
              placeholder='Disbursement Code'
              className='form-input w-full'
              value={code}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='bank_account_code'>Bank Account Code</label>
            <input
              id='bank_account_code'
              name='bank_account_code'
              type='text'
              placeholder='Bank Account Code'
              className='form-input w-full'
              value={bank_account_code}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='reference_code'>Reference Code</label>
            <input
              id='reference_code'
              name='reference_code'
              type='text'
              placeholder='Reference Code'
              className='form-input w-full'
              value={reference_code || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='disbursement_date'>Disbursement Date</label>
            <input
              id='disbursement_date'
              name='disbursement_date'
              type='text'
              placeholder='Disbursement Date'
              className='form-input w-full'
              value={formatDateDisplay(new Date(disbursement_date))}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='payment_method'>Payment Method</label>
            <input
              id='payment_method'
              name='payment_method'
              type='text'
              placeholder='Payment Method'
              className='form-input w-full'
              value={payment_method}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='payment_type'>Payment Type</label>
            <input
              id='payment_type'
              name='payment_type'
              type='text'
              placeholder='Payment Type'
              className='form-input w-full'
              value={payment_type}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='payment_reference'>Payment Reference</label>
            <input
              id='payment_reference'
              name='payment_reference'
              type='text'
              placeholder='Payment Reference'
              className='form-input w-full'
              value={payment_reference || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Disbursement Details</h2>
        <div className='flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='disbursement_amount'>Disbursement Amount</label>
            <input
              id='disbursement_amount'
              name='disbursement_amount'
              type='text'
              placeholder='Disbursement Amount'
              className='form-input w-full'
              value={formatCurrencyDisplay(disbursement_amount, 'IDR')}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='admin_fee'>Admin Fee</label>
            <input
              id='admin_fee'
              name='admin_fee'
              type='text'
              placeholder='Admin Fee'
              className='form-input w-full'
              value={formatCurrencyDisplay(admin_fee || 0, 'IDR')}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='total'>Total</label>
            <input
              id='total'
              name='total'
              type='text'
              placeholder='Total'
              className='form-input w-full'
              value={formatCurrencyDisplay(total, 'IDR')}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mt-5'>
          <label htmlFor='additional_notes'>Additional Notes</label>
          <textarea
            id='additional_notes'
            name='additional_notes'
            rows={3}
            className='form-textarea mt-1 block w-full'
            value={additional_notes || ''}
            disabled
            style={{ cursor: 'not-allowed' }}
          />
        </div>
      </div>

      <div className='mt-6 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Disbursement Item Details</h2>
        <table className='table-striped'>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Account</th>
              <th>Account Name</th>
              <th>Account Value</th>
              <th>Account Tax</th>
              <th>Other Account Fees</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {details.map(
              (detail: BankDisbursementDetailProperty, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{detail.account}</td>
                  <td>{detail.account_name}</td>
                  <td>{formatCurrencyDisplay(detail.account_value, 'IDR')}</td>
                  <td>
                    {formatCurrencyDisplay(detail.account_tax || 0, 'IDR')}
                  </td>
                  <td>
                    {formatCurrencyDisplay(
                      detail.other_account_fees || 0,
                      'IDR',
                    )}
                  </td>
                  <td>{formatCurrencyDisplay(detail.total_amount, 'IDR')}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className='mb-5 mt-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Created Information</h2>
        <div className='flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='created_by'>Created By</label>
            <input
              id='created_by'
              name='created_by'
              type='text'
              placeholder='Created By'
              className='form-input w-full'
              value={created_by}
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
      </div>
    </div>
  );
};

export default BankDisbursementDetailComponent;
