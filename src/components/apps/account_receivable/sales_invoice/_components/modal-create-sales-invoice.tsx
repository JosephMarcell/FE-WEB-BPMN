import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateSalesInvoice } from '@/app/api/hooks/account_receivable/sales_invoice/useCreateSalesInvoice';
import { useGetEligibleSalesOrders } from '@/app/api/hooks/account_receivable/sales_invoice/useGetEligibleSalesOrders';
import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import { useGetSalesOrderByCode } from '@/app/api/hooks/sales/sales_order/useCRUDSalesOrder';
import {
  Currency,
  salesInvoiceInitialState,
  SalesOrder,
} from '@/helpers/utils/account_receivable/sales_invoice';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import { isErrorResponse } from '@/helpers/utils/response_api/response_api';

interface IModalNewSalesInvoiceProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalCreateSalesInvoice = ({
  modal,
  setModal,
  refetch,
}: IModalNewSalesInvoiceProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listEligibleSalesOrders } = useGetEligibleSalesOrders();
  const { data: listCurrency } = useGetAllCurrency();
  const [selectedCode, setSelectedCode] = useState('');
  const { data: selectedSalesOrder, isSuccess } =
    useGetSalesOrderByCode(selectedCode);
  const createSalesInvoice = useCreateSalesInvoice();

  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [salesOrderDropdown, setSalesOrderDropdown] = useState<
    SelectOptionProperty[]
  >([]);
  const [currencyDropdown, setCurrencyDropdown] = useState<
    SelectOptionProperty[]
  >([]);

  const [form, setForm] = useState(salesInvoiceInitialState);
  const [descriptionLength, setDescriptionLength] = useState<number>(0);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [, setSubTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (listEligibleSalesOrders) {
      setSalesOrderDropdown(
        listEligibleSalesOrders.map((item: SalesOrder) => ({
          value: item.code,
          label: item.code,
        })),
      );
    }
    if (listCurrency) {
      setCurrencyDropdown(
        listCurrency.map((item: Currency) => ({
          value: item.code,
          label: item.name,
        })),
      );
    }
  }, [listEligibleSalesOrders, listCurrency]);

  useEffect(() => {
    const defaultCurrency = currencyDropdown.find(c => c.value === 'IDR');
    if (defaultCurrency) {
      setForm(prev => ({ ...prev, currency_code: defaultCurrency.value }));
    }
  }, [currencyDropdown]);

  useEffect(() => {
    if (isSuccess && selectedSalesOrder) {
      const subTotalItem = selectedSalesOrder.total_price || 0;
      setSubTotal(subTotalItem);

      const taxesAmount = form.taxes_included
        ? selectedSalesOrder.total_tax || 0
        : 0;

      let discountAmount = 0;
      if (form.discount_included) {
        if (form.discounts) {
          discountAmount = (subTotalItem * form.discounts) / 100;
        } else if (form.discount_amount) {
          discountAmount = form.discount_amount;
        }
      }

      const deliveryCost = form.delivery_cost_included
        ? form.delivery_cost || 0
        : 0;

      const calculatedTotal =
        parseFloat(subTotalItem.toString()) +
        parseFloat(taxesAmount.toString()) -
        parseFloat(discountAmount.toString()) +
        parseFloat((deliveryCost ?? 0).toString());

      setTotal(calculatedTotal);

      if (form.taxes_included) {
        setForm(prev => ({
          ...prev,
          sub_total_taxes: taxesAmount,
        }));
      }
    }
  }, [
    selectedSalesOrder,
    form.taxes_included,
    form.discount_included,
    form.discounts,
    form.delivery_cost_included,
    form.delivery_cost,
    isSuccess,
    form.currency_code,
    form.discount_amount,
  ]);

  const sanitizeInput = (input: string) => {
    const pattern = /[*'";{}()<>[\]]/g;
    return input.replace(pattern, '');
  };

  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    if (name === 'discounts') {
      let parsedValue = parseFloat((value as string).replace(/[^0-9]/g, ''));
      if (isNaN(parsedValue)) parsedValue = 0;
      parsedValue = Math.max(0, Math.min(parsedValue, 100));
      setForm(prev => ({ ...prev, [name]: parsedValue }));
    } else if (
      (name === 'delivery_cost' || name === 'discount_amount') &&
      typeof value === 'string'
    ) {
      const parsedValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
      setForm(prev => ({
        ...prev,
        [name]: parsedValue,
        discounts: name === 'discount_amount' ? 0 : form.discounts,
      }));
    } else if (name.includes('date') && value instanceof Date) {
      const newDate = new Date(value);
      newDate.setHours(12, 0, 0, 0);
      setForm({ ...form, [name]: newDate });
    } else if (name === 'description') {
      const sanitizedValue = sanitizeInput(value as string);
      setDescriptionLength(sanitizedValue.length);
      setForm({ ...form, [name]: sanitizedValue });
    } else if (name === 'invoice_number') {
      const sanitizedValue = sanitizeInput(value as string);
      setForm({ ...form, [name]: sanitizedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (
    value: SingleValue<SelectOptionProperty>,
    name: string,
  ) => {
    if (value) {
      setForm(prev => ({ ...prev, [name]: value.value }));
      if (name === 'sales_order_code') {
        setSelectedCode(value.value);
      }
    }
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = [
      'sales_order_code',
      'currency_code',
      'invoice_number',
      'invoice_date',
    ];

    const missingFields = requiredFields.filter(field => !form[field]);
    setEmptyField(missingFields);
    return missingFields.length === 0;
  };

  const formatFormToInvoiceProperty = (
    form: typeof salesInvoiceInitialState,
  ) => {
    return {
      ...form,
      invoice_date: form.invoice_date
        ? new Date(form.invoice_date.toISOString().split('T')[0])
        : null,
      due_date: form.due_date
        ? new Date(form.due_date.toISOString().split('T')[0])
        : null,
      dispatched_date: form.dispatched_date
        ? new Date(form.dispatched_date.toISOString().split('T')[0])
        : null,
    };
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!mandatoryValidation()) {
      await Swal.fire({
        title: 'Some Fields are Empty',
        text: 'Please fill all mandatory fields',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Make sure all data is correct',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, cancel!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          setIsLoadingCreate(true);
          await createSalesInvoice.mutateAsync(
            formatFormToInvoiceProperty(form),
          );
          setForm(salesInvoiceInitialState);
          setIsLoadingCreate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your sales invoice has been saved.',
            'success',
          ).then(() => {
            refetch();
          });
        } catch (error) {
          setIsLoadingCreate(false);
          let errorMessage = 'Something went wrong';
          if (isErrorResponse(error)) {
            const responseMessage = error.response.data.message;
            errorMessage = responseMessage
              ? responseMessage.replace(/^[A-Z]{2} - /, '')
              : errorMessage;
          }
          await Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  const formatCurrencyDisplay = (
    value: number,
    currencyCode: string,
  ): string => {
    if (isNaN(value)) return '';
    return `${currencyCode} ${value.toLocaleString('en-US')}`;
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(false)}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'>
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='my-8 w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg'>
              <div className='flex items-center justify-between border-b p-5 text-black'>
                <h5 className='text-lg font-bold'>Create New Sales Invoice</h5>
                <button
                  onClick={() => setModal(false)}
                  className='text-gray-400 hover:text-gray-500'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5 text-black'>
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label htmlFor='sales_order_code'>
                      Sales Order Code <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={salesOrderDropdown}
                      onChange={value =>
                        handleSelectChange(value, 'sales_order_code')
                      }
                      value={
                        salesOrderDropdown.find(
                          option => option.value === form.sales_order_code,
                        ) || null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='currency_code'>
                      Currency Code <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={currencyDropdown}
                      onChange={value =>
                        handleSelectChange(value, 'currency_code')
                      }
                      value={
                        currencyDropdown.find(
                          option => option.value === form.currency_code,
                        ) || null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='invoice_number'>
                      Invoice Number <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='invoice_number'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'invoice_number')
                      }
                      value={form.invoice_number?.toString()}
                      placeholder='Example: INV-12345'
                      style={{
                        borderColor: emptyField.includes('invoice_number')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  {selectedSalesOrder && (
                    <>
                      <div>
                        <label htmlFor='customer_name'>Customer Name</label>
                        <input
                          id='customer_name'
                          type='text'
                          className='form-input'
                          value={selectedSalesOrder.Customer.name}
                          readOnly
                        />
                      </div>
                      <div>
                        <label htmlFor='address'>Address</label>
                        <input
                          id='address'
                          type='text'
                          className='form-input'
                          value={selectedSalesOrder.Customer.address}
                          readOnly
                        />
                      </div>
                      <div>
                        <label htmlFor='phone_number'>Phone Number</label>
                        <input
                          id='phone_number'
                          type='text'
                          className='form-input'
                          value={selectedSalesOrder.Customer.phone_number}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label htmlFor='invoice_date'>
                      Invoice Date <span className='text-red-500'>*</span>
                    </label>
                    <Flatpickr
                      id='invoice_date'
                      name='invoice_date'
                      placeholder='Select Date'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'invoice_date')}
                      value={form.invoice_date || ''}
                      style={{
                        borderColor: emptyField.includes('invoice_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='due_date'>
                      Due Date <span className='text-red-500'>*</span>
                    </label>
                    <Flatpickr
                      id='due_date'
                      name='due_date'
                      placeholder='Select Date'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'due_date')}
                      value={form.due_date || ''}
                      style={{
                        borderColor: emptyField.includes('due_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='dispatched_date'>Dispatched Date</label>
                    <Flatpickr
                      id='dispatched_date'
                      name='dispatched_date'
                      placeholder='Select Date'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date =>
                        handleOnChange(date[0], 'dispatched_date')
                      }
                      value={form.dispatched_date || ''}
                      style={{
                        borderColor: emptyField.includes('dispatched_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>

                  <div className='col-span-1'>
                    <label
                      htmlFor='taxes_included'
                      className='block font-medium text-gray-700'
                    >
                      Taxes Included
                    </label>
                    <input
                      id='taxes_included'
                      type='checkbox'
                      checked={form.taxes_included as boolean}
                      onChange={e =>
                        handleOnChange(e.target.checked, 'taxes_included')
                      }
                      className='mt-1'
                    />
                    {form.taxes_included && (
                      <input
                        type='text'
                        placeholder='Taxes Amount'
                        className='mt-2 block w-full text-right'
                        value={formatCurrencyDisplay(
                          selectedSalesOrder?.total_tax || 0,
                          form.currency_code as string,
                        )}
                        readOnly
                      />
                    )}
                  </div>

                  <div className='col-span-1'>
                    <label
                      htmlFor='discount_included'
                      className='block font-medium text-gray-700'
                    >
                      Discount Included
                    </label>
                    <input
                      id='discount_included'
                      type='checkbox'
                      checked={form.discount_included as boolean}
                      onChange={e =>
                        handleOnChange(e.target.checked, 'discount_included')
                      }
                      className='mt-1'
                    />
                    {form.discount_included && (
                      <>
                        <div style={{ marginTop: '0.5rem' }}>
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <input
                              type='text'
                              value={form.discounts?.toString() || ''}
                              onChange={e =>
                                handleOnChange(e.target.value, 'discounts')
                              }
                              className='form-input'
                              placeholder='Discount Percent'
                              disabled={
                                !!(
                                  form.discount_amount &&
                                  form.discount_amount > 0
                                )
                              }
                            />
                          </div>
                        </div>
                        <input
                          type='text'
                          placeholder='Discount Amount'
                          value={formatCurrencyDisplay(
                            form.discount_amount ?? 0,
                            form.currency_code as string,
                          )}
                          onChange={e =>
                            handleOnChange(e.target.value, 'discount_amount')
                          }
                          className='mt-1 block w-full text-right'
                          disabled={!!(form.discounts && form.discounts > 0)}
                        />
                      </>
                    )}
                  </div>

                  <div className='col-span-1'>
                    <label
                      htmlFor='delivery_cost_included'
                      className='block font-medium text-gray-700'
                    >
                      Delivery Cost Included
                    </label>
                    <input
                      id='delivery_cost_included'
                      type='checkbox'
                      checked={form.delivery_cost_included as boolean}
                      onChange={e =>
                        handleOnChange(
                          e.target.checked,
                          'delivery_cost_included',
                        )
                      }
                      className='mt-1'
                    />
                    {form.delivery_cost_included && (
                      <input
                        type='text'
                        placeholder='Delivery Cost'
                        value={formatCurrencyDisplay(
                          form.delivery_cost ?? 0,
                          form.currency_code as string,
                        )}
                        onChange={e =>
                          handleOnChange(e.target.value, 'delivery_cost')
                        }
                        className='mt-1 block w-full text-right'
                      />
                    )}
                  </div>

                  <div className='col-span-3'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                      id='description'
                      className='form-textarea mt-1 block w-full'
                      rows={3}
                      maxLength={255}
                      onChange={e =>
                        handleOnChange(e.target.value, 'description')
                      }
                      value={form.description || ''}
                    />
                    <div className='text-right text-sm text-gray-500'>
                      {descriptionLength}/255
                    </div>
                  </div>

                  <div>
                    <label htmlFor='subTotal'>Sub-Total</label>
                    <input
                      type='text'
                      className='form-input text-right'
                      value={formatCurrencyDisplay(
                        selectedSalesOrder?.total_price || 0,
                        form.currency_code as string,
                      )}
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor='total'>Total</label>
                    <input
                      type='text'
                      className='form-input text-right'
                      value={formatCurrencyDisplay(
                        Number(total),
                        form.currency_code as string,
                      )}
                      readOnly
                      style={{
                        backgroundColor: 'yellow',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-end p-5'>
                {isLoadingCreate ? (
                  <button type='button' className='btn'>
                    <IconLoader /> Loading
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='btn btn-primary'
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCreateSalesInvoice;
