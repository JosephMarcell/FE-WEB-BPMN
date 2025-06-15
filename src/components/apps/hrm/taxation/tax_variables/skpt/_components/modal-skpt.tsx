import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateSKPT } from '@/app/api/hooks/hrm/tax_variables/skpt/useCreateSKPT';
import { useGetSKPTByPkid } from '@/app/api/hooks/hrm/tax_variables/skpt/useGetSKPTByPkid';
import { useUpdateSKPT } from '@/app/api/hooks/hrm/tax_variables/skpt/useUpdateSKPT';
import { skptInitialState } from '@/helpers/utils/hrm/tax_variables/skpt';

interface IModalRegisterSKPTProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalSKPT = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterSKPTProps) => {
  const { mutateAsync: createSKPT } = useCreateSKPT();
  const { mutateAsync: updateSKPT } = useUpdateSKPT();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(skptInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: skptDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetSKPTByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(skptDetail);
    }
  }, [pkid, modalEdit, skptDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'code',
      'description',
      'is_married',
      'is_wife',
      'tanggunan',
      'ter_category',
      'amount',
      'tunjangan_tetap',
      'pkid',
      'tenant',
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
    if (JSON.stringify(form) === JSON.stringify(skptInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(skptInitialState);
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
            setForm(skptInitialState);
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

              await updateSKPT({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createSKPT(form);
              setModal(false);
            }
            setForm(skptInitialState);
            setEmptyField([]);
            Swal.fire('Saved!', 'Your SKPT has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
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
      setForm(skptInitialState);
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
                <h5 className='text-lg font-bold'>SKPT</h5>
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
                    <label htmlFor='tunjangan_tetap'>
                      Tunjangan Tetap<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='tunjangan_tetap'
                      name='tunjangan_tetap'
                      type='number'
                      placeholder='Tunjangan Tetap'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          String(e.target.value),
                          'tunjangan_tetap',
                        )
                      }
                      value={form.tunjangan_tetap || ''}
                      style={{
                        borderColor: emptyField.includes('tunjangan_tetap')
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

export default ModalSKPT;
