import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateFiscalType } from '@/app/api/hooks/fixed_asset/fiscal_type/useCreateFiscalType';
import { useGetFiscalTypeByPkid } from '@/app/api/hooks/fixed_asset/fiscal_type/useGetFiscalTypeByPkid';
import { useUpdateFiscalType } from '@/app/api/hooks/fixed_asset/fiscal_type/useUpdateFiscalType';
import { fiscalTypeInitialState } from '@/helpers/utils/fixed_asset/fiscal_type';

interface IModalFiscalTypeProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
const typeOptions = [
  { value: 'Garis Lurus', label: 'Garis Lurus' },
  { value: 'Saldo Menurun', label: 'Saldo Menurun' },
];
const ModalFiscalType = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalFiscalTypeProps) => {
  const { mutateAsync: createFiscalType } = useCreateFiscalType();
  const { mutateAsync: updateFiscalType } = useUpdateFiscalType();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(fiscalTypeInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);

  const {
    data: fiscalTypeDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetFiscalTypeByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (fiscalTypeDetail && modalEdit) {
      setForm(fiscalTypeDetail);
    }
  }, [fiscalTypeDetail, modalEdit]);
  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'created_by',
      'created_date',
      'created_host',
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
        temp[field as keyof typeof temp] === 0 ||
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
  const handleOnChange = (value: string | number, key: string) => {
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(fiscalTypeInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(fiscalTypeInitialState);
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
            setForm(fiscalTypeInitialState);
            setEmptyField([]);
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      Swal.fire({
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

              await updateFiscalType({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createFiscalType(form);

              setModal(false);
            }
            setForm(fiscalTypeInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your fiscal type has been saved.',
              'success',
            ).then(() => {
              refetch();
            });
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(fiscalTypeInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };
  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog
        as='div'
        open={modal || modalEdit}
        onClose={() => {
          if (modalEdit) {
            setModalEdit(true);
          }
          if (modal) {
            setModal(true);
          }
        }}
      >
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
                  {modal ? 'New' : 'Edit'} Fiscal Type
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
                      Nama<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Nama Depresiasi'
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
                    <label htmlFor='estimated_life'>
                      Perkiraan Umur Manfaat (Tahun)
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='estimated_life'
                      name='estimated_life'
                      type='text'
                      placeholder='Perkiraan Umur Manfaat'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(Number(e.target.value), 'estimated_life')
                      }
                      value={form.estimated_life || ''}
                      style={{
                        borderColor: emptyField.includes('estimated_life')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='depreciation_method'>
                      Metode Depresiasi
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='depreciation_method'
                      name='depreciation_method'
                      placeholder='Pilih Metode Depresiasi'
                      className='basic-single'
                      options={typeOptions}
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
                          borderColor: emptyField.includes(
                            'depreciation_method',
                          )
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'depreciation_method',
                        )
                      }
                      value={
                        form.depreciation_method
                          ? {
                              value: form.depreciation_method ?? '',
                              label: form.depreciation_method ?? '',
                            }
                          : null
                      }
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

export default ModalFiscalType;
