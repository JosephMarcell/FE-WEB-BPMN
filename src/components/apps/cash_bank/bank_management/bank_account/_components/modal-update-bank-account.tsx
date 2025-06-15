import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetBankAccountByPkid } from '@/app/api/hooks/cash_bank/bank_account/useGetBankAccountByPkid';
import { useUpdateBankAccount } from '@/app/api/hooks/cash_bank/bank_account/useUpdateBankAccount';

interface IModalUpdateBankAccountProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

interface IForm {
  status: string;
  description: string;
}

const ModalUpdateBankAccount = ({
  modal,
  setModal,
  refetch,
}: IModalUpdateBankAccountProps) => {
  useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const {
    data: bankAccountData,
    isLoading,
    refetch: refetchDetail,
  } = useGetBankAccountByPkid(pkid);
  const updateBankAccount = useUpdateBankAccount();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [form, setForm] = useState<IForm>({
    status: 'active',
    description: '',
  });
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [descriptionLength, setDescriptionLength] = useState<number>(0);

  useEffect(() => {
    if (bankAccountData) {
      setForm({
        status: bankAccountData.result.status || 'active',
        description: bankAccountData.result.description || '',
      });
      setDescriptionLength(bankAccountData.result.description?.length || 0);
    }
  }, [bankAccountData]);

  useEffect(() => {
    if (pkid && modal && !isLoading) {
      refetchDetail();
    }
  }, [pkid, modal, isLoading, refetchDetail]);

  const sanitizeInput = (input: string) => {
    const pattern = /[*'";{}()<>[\]]/g;
    return input.replace(pattern, '');
  };

  const handleOnChange = (
    value: string | number | boolean | null,
    name: string,
  ) => {
    if (name === 'description') {
      const sanitizedValue = sanitizeInput(value as string);
      setForm({ ...form, [name]: sanitizedValue });
      setDescriptionLength(sanitizedValue.length);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (
    value: SingleValue<{ value: string; label: string }>,
    name: string,
  ) => {
    setForm({ ...form, [name]: value?.value || '' });
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = ['status'];

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
          setIsLoadingUpdate(true);
          await updateBankAccount.mutateAsync({
            data: {
              ...form,
            },
            pkid,
          });
          setIsLoadingUpdate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your bank account has been saved.',
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
                <h5 className='text-lg font-bold'>Update Bank Account</h5>
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
                      <label htmlFor='status'>Status</label>
                      <Select
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ]}
                        onChange={value => handleSelectChange(value, 'status')}
                        value={
                          form.status
                            ? {
                                value: form.status,
                                label:
                                  form.status.charAt(0).toUpperCase() +
                                  form.status.slice(1),
                              }
                            : null
                        }
                        styles={{
                          control: base => ({
                            ...base,
                            borderColor: emptyField.includes('status')
                              ? 'red'
                              : base.borderColor,
                          }),
                          menuPortal: base => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                      />
                    </div>
                    <div className='col-span-2'>
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

export default ModalUpdateBankAccount;
