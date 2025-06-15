import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { useCreateAssetRevaluation } from '@/app/api/hooks/fixed_asset/asset_revaluation/useCreateAssetRevaluation';
import { useGetAssetRevaluationByPkid } from '@/app/api/hooks/fixed_asset/asset_revaluation/useGetAssetRevaluationByPkid';
import { useUpdateAssetRevaluation } from '@/app/api/hooks/fixed_asset/asset_revaluation/useUpdateAssetRevaluation';
import { assetRevaluationInitialState } from '@/helpers/utils/fixed_asset/asset_revaluation';

interface IModalAssetRevaluationProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
// const optionsType = [
//   { value: 'Ringan', label: 'Ringan' },
//   { value: 'Sedang', label: 'Sedang' },
//   { value: 'Berat', label: 'Berat' },
// ];

const ModalAssetRevaluation = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalAssetRevaluationProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();
  const { mutateAsync: createAssetRevaluation } = useCreateAssetRevaluation();
  const { mutateAsync: updateAssetRevaluation } = useUpdateAssetRevaluation();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(assetRevaluationInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);

  const {
    data: assetRevaluationDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetRevaluationByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (assetRevaluationDetail && modalEdit) {
      setForm(assetRevaluationDetail);
    }
  }, [assetRevaluationDetail, modalEdit]);

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
      'status',
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
  const handleOnChange = (value: string | number | Date, key: string) => {
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(assetRevaluationInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(assetRevaluationInitialState);
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
            setForm(assetRevaluationInitialState);
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

              await updateAssetRevaluation({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createAssetRevaluation(form);

              setModal(false);
            }
            setForm(assetRevaluationInitialState);
            setEmptyField([]);
            Swal.fire('Saved!', 'Your request has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
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
      setForm(assetRevaluationInitialState);
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
                  {modal ? 'New' : 'Edit'} Revaluation Asset
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
                    <label htmlFor='title'>
                      Judul Revaluasi <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='title'
                      name='title'
                      type='text'
                      placeholder='Judul Revaluasi'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'title')
                      }
                      value={form.title || ''}
                      style={{
                        borderColor: emptyField.includes('title') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='asset_pkid'>
                      Nama Aset
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='asset_pkid'
                      name='asset_pkid'
                      placeholder='Pilih Aset'
                      className='basic-single'
                      options={listAsset?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item.name,
                      }))}
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
                          borderColor: emptyField.includes('asset_pkid')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'asset_pkid',
                        )
                      }
                      value={
                        form.asset_pkid
                          ? {
                              value: form.asset_pkid ?? '',
                              label:
                                listAsset?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.asset_pkid,
                                )?.name ?? '',
                            }
                          : null
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor='revaluation_amount'>
                      Jumlah Nilai Revaluasi{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='revaluation_amount'
                      name='revaluation_amount'
                      type='text'
                      placeholder='Nilai Revaluasi'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          Number(e.target.value),
                          'revaluation_amount',
                        )
                      }
                      value={form.revaluation_amount || ''}
                      style={{
                        borderColor: emptyField.includes('revaluation_amount')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='revaluation_date'>
                        Tanggal Revaluasi Aset{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='revaluation_date'
                        name='revaluation_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'revaluation_date')
                        }
                        value={form.revaluation_date || ''}
                        style={{
                          borderColor: emptyField.includes('revaluation_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='revaluation_year'>
                        Tahun Umur Manfaat baru{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='revaluation_year'
                        name='revaluation_year'
                        type='text'
                        placeholder='Nama Kategory'
                        className='form-input'
                        onChange={e =>
                          handleOnChange(
                            Number(e.target.value),
                            'revaluation_year',
                          )
                        }
                        value={form.revaluation_year || ''}
                        style={{
                          borderColor: emptyField.includes('revaluation_year')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='description'>
                      Deskripsi Revaluasi{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      rows={3}
                      className='form-textarea'
                      placeholder='Deskripsi Revaluasi'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'description')
                      }
                      value={form.description || ''}
                      required
                      style={{
                        borderColor: emptyField.includes('description')
                          ? 'red'
                          : '',
                      }}
                    ></textarea>
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

export default ModalAssetRevaluation;
