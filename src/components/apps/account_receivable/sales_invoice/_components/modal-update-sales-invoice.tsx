import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetSalesInvoiceByPkid } from '@/app/api/hooks/account_receivable/sales_invoice/useGetSalesInvoiceByPkid';
import { useUpdateSalesInvoice } from '@/app/api/hooks/account_receivable/sales_invoice/useUpdateSalesInvoice';

interface IModalUpdateSalesInvoiceProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

interface IForm {
  invoice_date: Date | undefined;
  due_date: Date | undefined;
  dispatched_date: Date | undefined;
  description: string;
}

const ModalUpdateSalesInvoice = ({
  modal,
  setModal,
  refetch,
}: IModalUpdateSalesInvoiceProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const {
    data: invoiceData,
    isLoading,
    refetch: refetchDetail,
  } = useGetSalesInvoiceByPkid(pkid);
  const updateSalesInvoice = useUpdateSalesInvoice();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<IForm>({
    invoice_date: undefined,
    due_date: undefined,
    dispatched_date: undefined,
    description: '',
  });

  useEffect(() => {
    if (invoiceData && invoiceData.result) {
      setForm({
        invoice_date: invoiceData.result.invoice_date
          ? new Date(invoiceData.result.invoice_date)
          : undefined,
        due_date: invoiceData.result.due_date
          ? new Date(invoiceData.result.due_date)
          : undefined,
        dispatched_date: invoiceData.result.dispatched_date
          ? new Date(invoiceData.result.dispatched_date)
          : undefined,
        description: invoiceData.result.description || '',
      });
    }
  }, [invoiceData]);

  useEffect(() => {
    if (pkid && modal && !isLoading) {
      refetchDetail();
    }
  }, [pkid, modal, isLoading, refetchDetail]);

  const handleOnChange = (value: string | Date | null, name: string) => {
    if (name.includes('date') && value instanceof Date) {
      const newDate = new Date(value);
      newDate.setHours(12, 0, 0, 0);
      setForm({ ...form, [name]: newDate });
    } else {
      setForm({ ...form, [name]: value as string });
    }
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
          await updateSalesInvoice.mutateAsync({
            data: form,
            pkid,
          });
          setIsLoadingUpdate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your sales invoice has been saved.',
            'success',
          ).then(() => {
            refetch();
          });
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
                <h5 className='text-lg font-bold'>Update Sales Invoice</h5>
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
                      <label htmlFor='invoice_date'>Invoice Date</label>
                      <Flatpickr
                        id='invoice_date'
                        name='invoice_date'
                        placeholder='Select Date'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'invoice_date')
                        }
                        value={form.invoice_date}
                      />
                    </div>
                    <div>
                      <label htmlFor='due_date'>Due Date</label>
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
                        value={form.due_date}
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
                        value={form.dispatched_date}
                      />
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
                        value={form.description}
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

export default ModalUpdateSalesInvoice;
