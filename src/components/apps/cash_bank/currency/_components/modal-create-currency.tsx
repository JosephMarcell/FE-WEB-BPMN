import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateCurrency } from '@/app/api/hooks/cash_bank/currency/useCreateCurrency';
import {
  currencyInitialState,
  CurrencyProperty,
} from '@/helpers/utils/cash_bank/currency';
import { isErrorResponse } from '@/helpers/utils/response_api/response_api';

interface IModalNewCurrencyProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalCreateCurrency = ({
  modal,
  setModal,
  refetch,
}: IModalNewCurrencyProps) => {
  useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const createCurrency = useCreateCurrency();
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [form, setForm] = useState<CurrencyProperty>(currencyInitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const handleOnChange = (value: string | number | boolean, name: string) => {
    setForm({ ...form, [name]: value });
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = ['code', 'name', 'symbol'];

    const missingFields = requiredFields.filter(field => !form[field]);
    setEmptyField(missingFields);
    return missingFields.length === 0;
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
          await createCurrency.mutateAsync(form);
          setForm(currencyInitialState);
          setIsLoadingCreate(false);
          setModal(false);
          Swal.fire('Saved!', 'Your currency has been saved.', 'success').then(
            () => {
              refetch();
            },
          );
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

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(false)}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'>
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='my-8 w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg'>
              <div className='flex items-center justify-between border-b p-5 text-black'>
                <h5 className='text-lg font-bold'>Create New Currency</h5>
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
                    <label htmlFor='code'>
                      Currency Code <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='code'
                      type='text'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'code')}
                      value={form.code}
                      placeholder='Example: USD'
                      style={{
                        borderColor: emptyField.includes('code') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='name'>
                      Currency Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='name'
                      type='text'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'name')}
                      value={form.name}
                      placeholder='Example: US Dollar'
                      style={{
                        borderColor: emptyField.includes('name') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='symbol'>
                      Currency Symbol <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='symbol'
                      type='text'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'symbol')}
                      value={form.symbol}
                      placeholder='Example: $'
                      style={{
                        borderColor: emptyField.includes('symbol') ? 'red' : '',
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

export default ModalCreateCurrency;
