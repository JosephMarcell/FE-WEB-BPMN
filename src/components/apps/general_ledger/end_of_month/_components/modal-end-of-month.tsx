import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAssetCategoryByPkid } from '@/app/api/hooks/fixed_asset/asset_category/useGetAssetCategoryByPkid';
import { useCreateEndOfMonth } from '@/app/api/hooks/general_ledger/end_of_month/useCreateEndOfMonth';
import { endOfMonthInitialState } from '@/helpers/utils/company/end_of_month';
import { listMonths, listYears } from '@/helpers/utils/global/listDate';
interface IModalRegisterAssetCategoryProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
const ModalEndOfMonth = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterAssetCategoryProps) => {
  const { mutateAsync: createEndOfMonth } = useCreateEndOfMonth();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(endOfMonthInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: assetCategoryDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetCategoryByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(assetCategoryDetail);
    }
  }, [pkid, modalEdit, assetCategoryDetail, isLoading, refetchDetail]);

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
  const handleOnChange = (
    value: string | number | null | undefined,
    key: string,
  ) => {
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(endOfMonthInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(endOfMonthInitialState);
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
            setForm(endOfMonthInitialState);
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
            const responseData = {
              isSuccess: false,
              message: '',
            };
            if (modalEdit) {
              // const tempForm = { ...form };
              // const formAfterDeletion = deleteBaseAttributes(tempForm);

              // await updateAssetCategory({
              //   pkid: pkid,
              //   data: formAfterDeletion,
              // });
              setModalEdit(false);
            }
            if (modal) {
              const response = await createEndOfMonth(form);
              responseData.isSuccess = response.isSuccess;
              responseData.message = response.message;
              setModal(false);
            }
            setForm(endOfMonthInitialState);
            setEmptyField([]);
            if (responseData.isSuccess) {
              Swal.fire(
                'Saved!',
                'Your End Of Month has been saved.',
                'success',
              ).then(() => {
                refetch();
              });
            } else {
              Swal.fire('Error!', responseData.message, 'error');
            }
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
      setForm(endOfMonthInitialState);
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
                  {modal ? 'New' : 'Edit'} Asset Category
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
                    <label htmlFor='month'>
                      Pilih Bulan<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='month'
                      placeholder='Pilih Bulan'
                      name='month'
                      className='basic-single'
                      options={listMonths}
                      isSearchable={true}
                      isClearable={true}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value ?? null, 'month')
                      }
                      value={
                        form.month
                          ? {
                              value: form.month ?? '',
                              label: form.month ?? '',
                            }
                          : null
                      }
                      menuPortalTarget={document.body}
                      styles={{
                        control: provided => ({
                          ...provided,
                          borderColor: emptyField.includes('month')
                            ? 'red'
                            : '',
                          zIndex: 9999,
                        }),
                        menuPortal: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='year'>
                      Pilih Tahun<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='year'
                      placeholder='Pilih Tahun'
                      name='year'
                      className='basic-single'
                      options={listYears}
                      isSearchable={true}
                      isClearable={true}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value ?? null, 'year')
                      }
                      value={
                        form.year
                          ? {
                              value: form.year ?? '',
                              label: form.year ?? '',
                            }
                          : null
                      }
                      menuPortalTarget={document.body}
                      styles={{
                        control: provided => ({
                          ...provided,
                          borderColor: emptyField.includes('year') ? 'red' : '',
                          zIndex: 9999,
                        }),
                        menuPortal: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
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

export default ModalEndOfMonth;
