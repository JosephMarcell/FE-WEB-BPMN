import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateWhiteCollarPayrollClass } from '@/app/api/hooks/hrm/white_collar_payroll_class/useCreateWhiteCollarPayrollClass';
import { useGetWhiteCollarPayrollClassByPkid } from '@/app/api/hooks/hrm/white_collar_payroll_class/useGetWhiteCollarPayrollClassByPkid';
import { useUpdateWhiteCollarPayrollClass } from '@/app/api/hooks/hrm/white_collar_payroll_class/useUpdateWhiteCollarPayrollClass';
import { whiteCollarPayrollClassInitialState } from '@/helpers/utils/hrm/white_collar_payroll_class';

interface IModalRegisterWhiteCollarPayrollClassProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalWhiteCollarPayrollClass = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterWhiteCollarPayrollClassProps) => {
  const { mutateAsync: createWhiteCollarPayrollClass } =
    useCreateWhiteCollarPayrollClass();
  const { mutateAsync: updateWhiteCollarPayrollClass } =
    useUpdateWhiteCollarPayrollClass();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(whiteCollarPayrollClassInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: whiteCollarPayrollClassDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetWhiteCollarPayrollClassByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(whiteCollarPayrollClassDetail);
    }
  }, [
    pkid,
    modalEdit,
    whiteCollarPayrollClassDetail,
    isLoading,
    refetchDetail,
  ]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'pkid',
      'updated_by',
      'updated_date',
      'updated_host',
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
    if (
      JSON.stringify(form) ===
      JSON.stringify(whiteCollarPayrollClassInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(whiteCollarPayrollClassInitialState);
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
            setForm(whiteCollarPayrollClassInitialState);
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

              await updateWhiteCollarPayrollClass({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createWhiteCollarPayrollClass(form);
              setModal(false);
            }
            setForm(whiteCollarPayrollClassInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your white collar payroll class has been saved.',
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
      setForm(whiteCollarPayrollClassInitialState);
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
                  {modalEdit ? 'Edit' : 'New'} White Collar Payroll Class
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
                    <label htmlFor='nama_golongan'>
                      Nama Golongan<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='nama_golongan'
                      name='nama_golongan'
                      type='text'
                      placeholder='Nama Golongan'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'nama_golongan')
                      }
                      value={form.nama_golongan || ''}
                      style={{
                        borderColor: emptyField.includes('nama_golongan')
                          ? 'red'
                          : '',
                      }}
                    />
                    {Array.from({ length: 34 }, (_, i) => (
                      <div key={i}>
                        <label htmlFor={`tahun_${i}`}>
                          Nilai Tahun {i}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id={`tahun_${i}`}
                          name={`tahun_${i}`}
                          type='number'
                          placeholder={`Tahun ${i}`}
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), `tahun_${i}`)
                          }
                          value={form[`tahun_${i}` as keyof typeof form] || ''}
                          style={{
                            borderColor: emptyField.includes(`tahun_${i}`)
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    ))}
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

export default ModalWhiteCollarPayrollClass;
