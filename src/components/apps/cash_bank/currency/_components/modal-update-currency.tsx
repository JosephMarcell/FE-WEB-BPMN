import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetCurrencyByPkid } from '@/app/api/hooks/cash_bank/currency/useGetCurrencyByPkid';
import { useUpdateCurrency } from '@/app/api/hooks/cash_bank/currency/useUpdateCurrency';

interface IModalUpdateCurrencyProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

interface IForm {
  code: string;
  name: string;
  symbol: string;
}

const ModalUpdateCurrency = ({
  modal,
  setModal,
  refetch,
}: IModalUpdateCurrencyProps) => {
  useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const {
    data: currencyData,
    isLoading,
    refetch: refetchDetail,
  } = useGetCurrencyByPkid(pkid);
  const updateCurrency = useUpdateCurrency();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<IForm>({
    code: '',
    name: '',
    symbol: '',
  });

  useEffect(() => {
    if (currencyData) {
      setForm({
        code: currencyData.code || '',
        name: currencyData.name || '',
        symbol: currencyData.symbol || '',
      });
    }
  }, [currencyData]);

  useEffect(() => {
    if (pkid && modal && !isLoading) {
      refetchDetail();
    }
  }, [pkid, modal, isLoading, refetchDetail]);

  const handleOnChange = (value: string | null, name: string) => {
    setForm({ ...form, [name]: value as string });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
          setIsLoadingUpdate(true);
          await updateCurrency.mutateAsync({
            data: form,
            pkid,
          });
          setIsLoadingUpdate(false);
          setModal(false);
          Swal.fire('Saved!', 'Your currency has been saved.', 'success').then(
            () => {
              refetch();
            },
          );
        } catch (error) {
          setIsLoadingUpdate(false);
          await Swal.fire('Error!', 'Something went wrong', 'error');
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
                <h5 className='text-lg font-bold'>Update Currency</h5>
                <button
                  onClick={() => setModal(false)}
                  className='text-gray-400 hover:text-gray-500'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5 text-black'>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <label htmlFor='code'>Currency Code</label>
                      <input
                        id='code'
                        type='text'
                        className='form-input'
                        onChange={e => handleOnChange(e.target.value, 'code')}
                        value={form.code}
                      />
                    </div>
                    <div>
                      <label htmlFor='name'>Currency Name</label>
                      <input
                        id='name'
                        type='text'
                        className='form-input'
                        onChange={e => handleOnChange(e.target.value, 'name')}
                        value={form.name}
                      />
                    </div>
                    <div>
                      <label htmlFor='symbol'>Currency Symbol</label>
                      <input
                        id='symbol'
                        type='text'
                        className='form-input'
                        onChange={e => handleOnChange(e.target.value, 'symbol')}
                        value={form.symbol}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='flex justify-end p-5'>
                {isLoadingUpdate ? (
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

export default ModalUpdateCurrency;
