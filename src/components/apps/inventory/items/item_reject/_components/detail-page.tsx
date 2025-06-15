'use client';

import React from 'react';

import { ItemDetail } from '@/helpers/utils/inventory/item/item';

interface IItemRejectDetail {
  data: ItemDetail;
}

const formatCurrencyDisplay = (value: number, currencyCode: string): string => {
  if (isNaN(value)) return '-';
  return `${currencyCode} ${value.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDateDisplay = (date: string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatNumberDisplay = (value: number | null): string => {
  if (value === null || isNaN(value)) return '-';
  return parseFloat(value.toString()).toString(); // Ensure no trailing zeros
};

const formatDimensionsDisplay = (dimensions: string | null): string => {
  if (!dimensions) return '-';
  return dimensions
    .split('x')
    .map(dim => {
      const num = parseFloat(dim);
      return isNaN(num) ? dim : num.toString();
    })
    .join('x');
};

const ItemRejectDetailComponent = ({ data }: IItemRejectDetail) => {
  const {
    currency_code,
    name,
    purchase_price,
    selling_price,
    description,
    sku,
    barcode,
    weight,
    dimensions,
    currency,
    tax,
    item_category,
    created_date,
    updated_date,
  } = data;

  return (
    <div className='panel border-white-light h-full px-0 pb-10'>
      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>General Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='name'>Name</label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Name'
              className='form-input w-full'
              value={name || '-'}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='sku'>SKU</label>
            <input
              id='sku'
              name='sku'
              type='text'
              placeholder='SKU'
              className='form-input w-full'
              value={sku || '-'}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='purchase_price'>Purchase Price</label>
            <input
              id='purchase_price'
              name='purchase_price'
              type='text'
              placeholder='Purchase Price'
              className='form-input w-full'
              value={formatCurrencyDisplay(
                Number(purchase_price),
                currency_code || 'IDR',
              )}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='selling_price'>Selling Price</label>
            <input
              id='selling_price'
              name='selling_price'
              type='text'
              placeholder='Selling Price'
              className='form-input w-full'
              value={formatCurrencyDisplay(
                Number(selling_price),
                currency_code || 'IDR',
              )}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='barcode'>Barcode</label>
            <input
              id='barcode'
              name='barcode'
              type='text'
              placeholder='Barcode'
              className='form-input w-full'
              value={barcode || '-'}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='weight'>Weight</label>
            <input
              id='weight'
              name='weight'
              type='text'
              placeholder='Weight'
              className='form-input w-full'
              value={formatNumberDisplay(weight)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='dimensions'>Dimensions</label>
            <input
              id='dimensions'
              name='dimensions'
              type='text'
              placeholder='Dimensions'
              className='form-input w-full'
              value={formatDimensionsDisplay(dimensions)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
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
        </div>
        <div className='mb-5'>
          <label
            htmlFor='description'
            className='block text-lg font-medium text-gray-700'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            rows={3}
            className='form-textarea mt-1 block w-full'
            value={description || '-'}
            disabled
            style={{ cursor: 'not-allowed' }}
          />
        </div>
      </div>

      {item_category && (
        <div className='mb-5 px-5'>
          <h2 className='mb-4 text-xl font-bold'>Item Category</h2>
          <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
            <div className='w-full'>
              <label htmlFor='item_category_name'>Category Name</label>
              <input
                id='item_category_name'
                name='item_category_name'
                type='text'
                placeholder='Category Name'
                className='form-input w-full'
                value={item_category.name}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='item_category_description'>
                Category Description
              </label>
              <input
                id='item_category_description'
                name='item_category_description'
                type='text'
                placeholder='Category Description'
                className='form-input w-full'
                value={item_category.description || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>
      )}

      {currency && (
        <div className='mb-5 px-5'>
          <h2 className='mb-4 text-xl font-bold'>Currency</h2>
          <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
            <div className='w-full'>
              <label htmlFor='currency_code'>Currency Code</label>
              <input
                id='currency_code'
                name='currency_code'
                type='text'
                placeholder='Currency Code'
                className='form-input w-full'
                value={currency.code}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='currency_name'>Currency Name</label>
              <input
                id='currency_name'
                name='currency_name'
                type='text'
                placeholder='Currency Name'
                className='form-input w-full'
                value={currency.name || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='currency_symbol'>Currency Symbol</label>
              <input
                id='currency_symbol'
                name='currency_symbol'
                type='text'
                placeholder='Currency Symbol'
                className='form-input w-full'
                value={currency.symbol || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>
      )}

      {tax && (
        <div className='mb-5 px-5'>
          <h2 className='mb-4 text-xl font-bold'>Tax</h2>
          <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
            <div className='w-full'>
              <label htmlFor='tax_code'>Tax Code</label>
              <input
                id='tax_code'
                name='tax_code'
                type='text'
                placeholder='Tax Code'
                className='form-input w-full'
                value={tax.code || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='tax_name'>Tax Name</label>
              <input
                id='tax_name'
                name='tax_name'
                type='text'
                placeholder='Tax Name'
                className='form-input w-full'
                value={tax.name || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div className='w-full'>
              <label htmlFor='tax_rate'>Tax Rate</label>
              <input
                id='tax_rate'
                name='tax_rate'
                type='text'
                placeholder='Tax Rate'
                className='form-input w-full'
                value={tax.rate || '-'}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='w-full'>
            <label htmlFor='tax_description'>Tax Description</label>
            <input
              id='tax_description'
              name='tax_description'
              type='text'
              placeholder='Tax Description'
              className='form-input w-full'
              value={tax.description || '-'}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemRejectDetailComponent;
