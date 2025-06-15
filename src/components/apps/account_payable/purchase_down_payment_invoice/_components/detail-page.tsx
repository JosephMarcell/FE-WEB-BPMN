'use client';

import React from 'react';

import { PurchaseDownPaymentInvoiceDetail } from '@/helpers/utils/account_payable/purchase_down_payment_invoice';

interface IPurchaseDownPaymentInvoiceDetail {
  data: PurchaseDownPaymentInvoiceDetail;
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

const PurchaseDownPaymentInvoiceDetailComponent = ({
  data,
}: IPurchaseDownPaymentInvoiceDetail) => {
  const {
    invoice_number,
    purchase_order_code,
    total,
    dp_paid_amount,
    sub_total,
    taxes,
    discount_amount,
    remaining_payments,
    description,
    purchaseOrder,
    currency_code,
    invoice_date,
    due_date,
    received_date,
    delivery_cost,
  } = data;

  return (
    <div className='panel border-white-light h-full px-0 pb-10'>
      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>General Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='invoice_number'>Invoice Number</label>
            <input
              id='invoice_number'
              name='invoice_number'
              type='text'
              placeholder='Invoice Number'
              className='form-input w-full'
              value={invoice_number}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='purchase_order_code'>Purchase Order Code</label>
            <input
              id='purchase_order_code'
              name='purchase_order_code'
              type='text'
              placeholder='Purchase Order Code'
              className='form-input w-full'
              value={purchase_order_code}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='invoice_date'>Invoice Date</label>
            <input
              id='invoice_date'
              name='invoice_date'
              type='text'
              placeholder='Invoice Date'
              className='form-input w-full'
              value={formatDateDisplay(invoice_date)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='due_date'>Due Date</label>
            <input
              id='due_date'
              name='due_date'
              type='text'
              placeholder='Due Date'
              className='form-input w-full'
              value={formatDateDisplay(due_date)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='received_date'>Received Date</label>
            <input
              id='received_date'
              name='received_date'
              type='text'
              placeholder='Received Date'
              className='form-input w-full'
              value={formatDateDisplay(received_date)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Supplier Information</h2>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='supplier_name'>Supplier Name</label>
            <input
              id='supplier_name'
              name='supplier_name'
              type='text'
              placeholder='Supplier Name'
              className='form-input w-full'
              value={purchaseOrder.Supplier.name}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='supplier_phone_number'>Supplier Phone Number</label>
            <input
              id='supplier_phone_number'
              name='supplier_phone_number'
              type='text'
              placeholder='Supplier Phone Number'
              className='form-input w-full'
              value={purchaseOrder.Supplier.phone_number}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='supplier_address'>Supplier Address</label>
            <input
              id='supplier_address'
              name='supplier_address'
              type='text'
              placeholder='Supplier Address'
              className='form-input w-full'
              value={purchaseOrder.Supplier.address}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='supplier_npwp'>Supplier NPWP</label>
            <input
              id='supplier_npwp'
              name='supplier_npwp'
              type='text'
              placeholder='Supplier NPWP'
              className='form-input w-full'
              value={purchaseOrder.Supplier.npwp}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
      </div>

      <div className='mb-5 px-5'>
        <h2 className='mb-4 text-xl font-bold'>Payment Information</h2>
        <div className='flex flex-col gap-5 md:flex-row md:items-center'>
          <div className='w-full'>
            <label htmlFor='total'>Total Amount</label>
            <input
              id='total'
              name='total'
              type='text'
              placeholder='Total Amount'
              className='form-input w-full'
              value={formatCurrencyDisplay(Number(total), currency_code)}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='dp_paid_amount'>Down Payment Paid Amount</label>
            <input
              id='dp_paid_amount'
              name='dp_paid_amount'
              type='text'
              placeholder='DP Paid Amount'
              className='form-input w-full'
              value={formatCurrencyDisplay(
                Number(dp_paid_amount),
                currency_code,
              )}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
          <div className='w-full'>
            <label htmlFor='remaining_payments'>Remaining Payments</label>
            <input
              id='remaining_payments'
              name='remaining_payments'
              type='text'
              placeholder='Remaining Payments'
              className='form-input w-full'
              value={formatCurrencyDisplay(
                Number(remaining_payments),
                currency_code,
              )}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
          </div>
        </div>
        <div className='mb-5 mt-5'>
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
            value={description}
            disabled
            style={{ cursor: 'not-allowed' }}
          />
        </div>

        <div className=' mt-6'>
          <table className='table-striped'>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>ITEM</th>
                <th>UNIT</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrder.PurchaseDetails.map((detail, index) => (
                <tr key={detail.pkid}>
                  <td>{index + 1}</td>
                  <td>{detail.itemData.name}</td>
                  <td>{detail.itemData.unit}</td>
                  <td>{detail.quantity}</td>
                  <td>{formatCurrencyDisplay(detail.price, currency_code)}</td>
                  <td>
                    {formatCurrencyDisplay(
                      detail.quantity * detail.price,
                      currency_code,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2'>
          <div></div>
          <div className='space-y-2 ltr:text-right rtl:text-left'>
            <div className='flex items-center'>
              <div className='flex-1'>Subtotal</div>
              <div className='w-[37%]'>
                {formatCurrencyDisplay(Number(sub_total), currency_code)}
              </div>
            </div>
            <div className='flex items-center'>
              <div className='flex-1'>Tax</div>
              <div className='w-[37%]'>
                {formatCurrencyDisplay(Number(taxes), currency_code)}
              </div>
            </div>
            <div className='flex items-center'>
              <div className='flex-1'>Discount</div>
              <div className='w-[37%]'>
                {formatCurrencyDisplay(Number(discount_amount), currency_code)}
              </div>
            </div>
            <div className='flex items-center'>
              <div className='flex-1'>Delivery Cost</div>
              <div className='w-[37%]'>
                {formatCurrencyDisplay(Number(delivery_cost), currency_code)}
              </div>
            </div>
            <div className='flex items-center text-lg font-semibold'>
              <div className='flex-1'>Grand Total</div>
              <div className='w-[37%]'>
                {formatCurrencyDisplay(Number(total), currency_code)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDownPaymentInvoiceDetailComponent;
