import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateCharity } from '@/app/api/hooks/hrm/charity/useCreateCharity';
import { useGetCharityByPkid } from '@/app/api/hooks/hrm/charity/useGetCharityByPkid';
import { useUpdateCharity } from '@/app/api/hooks/hrm/charity/useUpdateCharity';
import { charityInitialState } from '@/helpers/utils/hrm/charity';

interface IModalRegisterCharityProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: string | null | undefined;
  label: string;
}

const optionsType = [
  { value: 'Percentage', label: 'Percentage' },
  { value: 'Nominal', label: 'Nominal' },
];

const ModalCharity = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterCharityProps) => {
  const { mutateAsync: createCharity } = useCreateCharity();
  const { mutateAsync: updateCharity } = useUpdateCharity();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(charityInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: charityDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetCharityByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(charityDetail);
    }
  }, [pkid, modalEdit, charityDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === undefined
      ) {
        requiredField.push(field);
      }
    });
    if (requiredField.length > 0) {
      setEmptyField(requiredField);
      return false;
    }
    return true;
  };
  const handleOnChange = (value: string, key: string) => {
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(charityInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(charityInitialState);
      setEmptyField([]);
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your data will not be saved!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Discard it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            setForm(charityInitialState);
            setEmptyField([]);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateCharity({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createCharity(form);
              setModal(false);
            }
            setForm(charityInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your insurance has been saved.',
              'success',
            ).then(() => {
              refetch();
            });
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(charityInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog as='div' open={modal || modalEdit} onClose={() => setModal(true)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0' />
        </Transition.Child>
        <div
          id='slideIn_down_modal'
          className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  {modalEdit ? 'Edit' : 'New'} Charity
                </h5>
                <button
                  onClick={handleClose}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5'>
                <div className='space-y-5'>
                  <div>
                    <label htmlFor='name'>
                      Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Insert Name'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'name')
                      }
                      value={form.name || ''}
                      style={{
                        borderColor: emptyField.includes('name') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='name'>
                      Email <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='Insert Email'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'email')
                      }
                      value={form.email || ''}
                      style={{
                        borderColor: emptyField.includes('email') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='address'>
                      Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='address'
                      name='address'
                      type='text'
                      placeholder='Insert Address'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'address')
                      }
                      value={form.address || ''}
                      style={{
                        borderColor: emptyField.includes('address')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='phone'>
                      Phone<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='phone'
                      name='phone'
                      type='text'
                      placeholder='Insert Phone Number'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'phone')
                      }
                      value={form.phone || ''}
                      style={{
                        borderColor: emptyField.includes('phone') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='charity_type'>
                      Charity Type<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='charity_type'
                      name='charity_type'
                      placeholder='Insert Charity Type'
                      className='basic-single'
                      options={optionsType}
                      isSearchable={true}
                      isClearable={true}
                      maxMenuHeight={150}
                      menuPlacement='top'
                      styles={{
                        menu: provided => ({
                          ...provided,
                          zIndex: 9999, // Set a high z-index value
                        }),
                        control: provided => ({
                          ...provided,
                          borderColor: emptyField.includes('amal_type')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value || '', 'amal_type')
                      }
                      value={
                        form.amal_type
                          ? {
                              value: form.amal_type ?? '',
                              label: form.amal_type ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='charity_amount'>
                      Charity Amount<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='charity_amount'
                      name='charity_amount'
                      type='number'
                      placeholder='Insert Charity Amount'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'amal_amount')
                      }
                      value={form.amal_amount || ''}
                      style={{
                        borderColor: emptyField.includes('amal_amount')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                  <button
                    onClick={handleCancel}
                    type='button'
                    className='btn btn-outline-danger'
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
                  >
                    Save
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCharity;
