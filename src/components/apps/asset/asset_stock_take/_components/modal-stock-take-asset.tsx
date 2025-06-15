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
import { useCreateAssetStockTake } from '@/app/api/hooks/fixed_asset/asset_stock_take/useCreateAssetStockTake';
import { useGetAssetStockTakeByPkid } from '@/app/api/hooks/fixed_asset/asset_stock_take/useGetAssetStockTakeByPkid';
import { useUpdateAssetStockTake } from '@/app/api/hooks/fixed_asset/asset_stock_take/useUpdateAssetStockTake';
import { assetStockTakeInitialState } from '@/helpers/utils/fixed_asset/asset_stock_take';

interface IModalAssetStockTakeProps {
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
const ModalAssetStockTake = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalAssetStockTakeProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();
  const { mutateAsync: createAssetStockTake } = useCreateAssetStockTake();
  const { mutateAsync: updateAssetStockTake } = useUpdateAssetStockTake();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(assetStockTakeInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);

  const {
    data: assetStockTakeDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetStockTakeByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (assetStockTakeDetail && modalEdit) {
      setForm(assetStockTakeDetail);
    }
  }, [assetStockTakeDetail, modalEdit]);

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
    if (JSON.stringify(form) === JSON.stringify(assetStockTakeInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(assetStockTakeInitialState);
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
            setForm(assetStockTakeInitialState);
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

              await updateAssetStockTake({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createAssetStockTake(form);

              setModal(false);
            }
            setForm(assetStockTakeInitialState);
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
      setForm(assetStockTakeInitialState);
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
                  {modal ? 'New' : 'Edit'} Stock Take Asset
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
                      Judul Stock Take <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='title'
                      name='title'
                      type='text'
                      placeholder='Judul Stock Take'
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
                    <label htmlFor='stock_take_by'>
                      Nama Penilai Aset <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='stock_take_by'
                      name='stock_take_by'
                      type='text'
                      placeholder='Nama Penilai'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'stock_take_by')
                      }
                      value={form.stock_take_by || ''}
                      style={{
                        borderColor: emptyField.includes('stock_take_by')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='condition_of_assets'>
                      Kondisi Aset <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='condition_of_assets'
                      name='condition_of_assets'
                      type='text'
                      placeholder='Kondisi Aset'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          String(e.target.value),
                          'condition_of_assets',
                        )
                      }
                      value={form.condition_of_assets || ''}
                      style={{
                        borderColor: emptyField.includes('condition_of_assets')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='stock_take_date'>
                      Tanggal Stock Take Aset{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      id='stock_take_date'
                      name='stock_take_date'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date =>
                        handleOnChange(date[0], 'stock_take_date')
                      }
                      value={form.stock_take_date || ''}
                      style={{
                        borderColor: emptyField.includes('stock_take_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor='description'>
                      Deskripsi Stock Take{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      rows={3}
                      className='form-textarea'
                      placeholder='Enter Address'
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

export default ModalAssetStockTake;
