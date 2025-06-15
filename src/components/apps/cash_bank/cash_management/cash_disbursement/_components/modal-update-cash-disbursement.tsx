import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetCashDisbursementByPkid } from '@/app/api/hooks/cash_bank/cash_disbursement/useGetCashDisbursementByPkid';
import { useUpdateCashDisbursement } from '@/app/api/hooks/cash_bank/cash_disbursement/useUpdateCashDisbursement';

interface IModalUpdateCashDisbursementProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

interface IForm {
  disbursement_date: string;
  additional_notes: string;
}

const ModalUpdateCashDisbursement = ({
  modal,
  setModal,
  refetch,
}: IModalUpdateCashDisbursementProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const {
    data: cashDisbursementData,
    isLoading,
    refetch: refetchDetail,
  } = useGetCashDisbursementByPkid(pkid);
  const updateCashDisbursement = useUpdateCashDisbursement();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<IForm>({
    disbursement_date: '',
    additional_notes: '',
  });

  useEffect(() => {
    if (pkid && modal && !isLoading) {
      refetchDetail();
    }
  }, [pkid, modal, isLoading, refetchDetail]);

  useEffect(() => {
    if (cashDisbursementData?.result) {
      const disbursementDate = new Date(
        cashDisbursementData.result.disbursement_date,
      );
      disbursementDate.setHours(12, 0, 0, 0); // Set time to noon to avoid timezone issues

      setForm({
        disbursement_date: disbursementDate.toISOString().split('T')[0],
        additional_notes: cashDisbursementData.result.additional_notes || '',
      });
    }
  }, [cashDisbursementData]);

  const sanitizeInput = (input: string) => {
    const pattern = /[*'";{}()<>[\]]/g;
    return input.replace(pattern, '');
  };

  const handleOnChange = (value: string | Date | null, name: string) => {
    if (name === 'disbursement_date' && value instanceof Date) {
      const newDate = new Date(value);
      newDate.setHours(12, 0, 0, 0); // Set time to noon to avoid timezone issues
      setForm(prev => ({
        ...prev,
        [name]: newDate.toISOString().split('T')[0],
      }));
    } else if (name === 'additional_notes') {
      const sanitizedValue = sanitizeInput(value as string);
      setForm(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value as string }));
    }
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = [
      'disbursement_date',
      'additional_notes',
    ];

    const missingFields = requiredFields.filter(field => !form[field]);
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
          setIsLoadingUpdate(true);
          await updateCashDisbursement.mutateAsync({
            data: form,
            pkid,
          });
          setIsLoadingUpdate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your cash disbursement has been saved.',
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
                <h5 className='text-lg font-bold'>Update Cash Disbursement</h5>
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
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='disbursement_date'>
                        Disbursement Date
                      </label>
                      <Flatpickr
                        id='disbursement_date'
                        name='disbursement_date'
                        placeholder='Select Date'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'disbursement_date')
                        }
                        value={
                          form.disbursement_date
                            ? new Date(form.disbursement_date)
                            : undefined
                        }
                      />
                    </div>
                    <div className='col-span-2'>
                      <label htmlFor='additional_notes'>Additional Notes</label>
                      <textarea
                        id='additional_notes'
                        className='form-textarea mt-1 block w-full'
                        rows={3}
                        maxLength={255}
                        onChange={e =>
                          handleOnChange(e.target.value, 'additional_notes')
                        }
                        value={form.additional_notes || ''}
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

export default ModalUpdateCashDisbursement;
