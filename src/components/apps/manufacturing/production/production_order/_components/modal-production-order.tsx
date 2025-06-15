import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import PredictTimeline from '@/components/apps/manufacturing/production/production_request/_components/timeline';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAssetCategoryByPkid } from '@/app/api/hooks/fixed_asset/asset_category/useGetAssetCategoryByPkid';
import { useGetItemByCategory } from '@/app/api/hooks/inventory/items/item/useGetItemByCategory';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useCreateProductionOrder } from '@/app/api/hooks/manufacturing/production_order/useCreateProductionOrder';
import { useUpdateProductionOrder } from '@/app/api/hooks/manufacturing/production_order/useUpdateProductionOrder';
import { useGetAllProductionRequestByStatus } from '@/app/api/hooks/manufacturing/production_request/useGetAllProductionRequestByStatus';
import { useGetPredictProduction } from '@/app/api/hooks/scheduling/manufacture_scheduling/useGetPredictProduction';
import { productionOrderInitialState } from '@/helpers/utils/manufacturing/production_order';
import { PredictResultProperty } from '@/helpers/utils/scheduling/predict';
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
interface IModalRegisterProductionOrderProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalProductionOrder = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterProductionOrderProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listProductionRequest } =
    useGetAllProductionRequestByStatus('ready');

  const { mutateAsync: createProductionOrder } = useCreateProductionOrder();
  const { mutateAsync: updateProductionOrder } = useUpdateProductionOrder();
  const { mutateAsync: getPredictProduction } = useGetPredictProduction();
  const { data: listEndProducts } = useGetItemByCategory(1);
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();

  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(productionOrderInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [listPredict, setListPredict] = useState<PredictResultProperty[]>([]);
  const [openModalPredict, setOpenModalPredict] = useState(false);

  const {
    data: assetCategoryDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetCategoryByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (assetCategoryDetail) {
      setForm(assetCategoryDetail);
    }
  }, [assetCategoryDetail]);

  useEffect(() => {
    if (form.production_request_pkid && modal) {
      const selectedProductionRequest = listProductionRequest?.find(
        (item: { pkid: number }) => item.pkid === form.production_request_pkid,
      );

      if (selectedProductionRequest) {
        setForm(prevForm => ({
          ...prevForm,
          item_pkid: selectedProductionRequest.item_pkid,
          start: selectedProductionRequest.start,
          end: selectedProductionRequest.end,
          quantity: selectedProductionRequest.quantity,
          warehouse_pkid: selectedProductionRequest.warehouse_pkid,
        }));
      } else {
        setForm(prevForm => ({
          ...prevForm,
          item_pkid: null,
          start: null,
          end: null,
          quantity: null,
          warehouse_pkid: null,
        }));
      }
    }
  }, [form.production_request_pkid, listProductionRequest, modal]);

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
      'pkid',
      'status',
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
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    if (name.includes('start') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }

    setForm({ ...form, [name]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(productionOrderInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(productionOrderInitialState);
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
            setForm(productionOrderInitialState);
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

              await updateProductionOrder({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              delete (form as unknown as { status?: number }).status;
              delete (form as unknown as { pkid?: number }).pkid;

              await createProductionOrder(form);
              setModal(false);
            }
            setForm(productionOrderInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your production request has been saved.',
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
  const handleOpenPredict = async () => {
    const responsePredict = await getPredictProduction({
      item_pkid: form.item_pkid,
      quantity: form.quantity,
    });

    if (responsePredict) {
      setListPredict(responsePredict.predict);
      setOpenModalPredict(true);
      localStorage.setItem('predict', JSON.stringify(responsePredict));
      setForm((prevFrom: typeof form) => ({
        ...prevFrom,
        end: responsePredict.end_date,
      }));
    } else {
      Swal.fire('Error', 'Routing Data Tidak Tersedia', 'error');
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(productionOrderInitialState);
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
                  {modal ? 'New' : 'Edit'} Producction Order
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
                    <label htmlFor='production_request_pkid'>
                      Cari Production Request
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='production_request_pkid'
                      name='production_request_pkid'
                      placeholder='Pilih Production Request'
                      className='basic-single'
                      options={listProductionRequest?.map(
                        (item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.code,
                        }),
                      )}
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
                            'production_request_pkid',
                          )
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'production_request_pkid',
                        )
                      }
                      value={
                        form.production_request_pkid
                          ? {
                              value: form.production_request_pkid ?? '',
                              label:
                                listProductionRequest?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.production_request_pkid,
                                )?.code ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='item_pkid'>
                        Nama Item
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='item_pkid'
                        name='item_pkid'
                        placeholder='Pilih Item'
                        className='basic-single'
                        options={listEndProducts?.map((item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.name,
                        }))}
                        isDisabled
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
                            borderColor: emptyField.includes('item_pkid')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || '',
                            'item_pkid',
                          )
                        }
                        value={
                          form.item_pkid
                            ? {
                                value: form.item_pkid ?? '',
                                label:
                                  listEndProducts?.find(
                                    (item: OptionSelect) =>
                                      item.pkid === form.item_pkid,
                                  )?.name ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor='warehouse_pkid'>
                        Nama Warehouse
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='warehouse_pkid'
                        name='warehouse_pkid'
                        placeholder='Pilih Warehouse'
                        isDisabled
                        className='basic-single'
                        options={listWarehouse?.map((item: OptionSelect) => ({
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
                            borderColor: emptyField.includes('warehouse_pkid')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || '',
                            'warehouse_pkid',
                          )
                        }
                        value={
                          form.warehouse_pkid
                            ? {
                                value: form.warehouse_pkid ?? '',
                                label:
                                  listWarehouse?.find(
                                    (item: OptionSelect) =>
                                      item.pkid === form.warehouse_pkid,
                                  )?.name ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor='start'>
                      Tanggal/Waktu Mulai Produksi{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      // value={date1}
                      id='start'
                      name='start'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d-H:i:S',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'start')}
                      value={form.start || ''}
                      style={{
                        borderColor: emptyField.includes('start') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='end'>
                      Tanggal/Waktu Selesai Produksi{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      // value={date1}
                      id='end'
                      name='end'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d-H:i:S',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'end')}
                      value={form.end || ''}
                      style={{
                        borderColor: emptyField.includes('end') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='quantity'>
                      Quantity<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='quantity'
                      name='quantity'
                      type='text'
                      disabled
                      placeholder='Jumlah Produksi'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'quantity')
                      }
                      value={form.quantity || ''}
                      style={{
                        borderColor: emptyField.includes('quantity')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <div className='w-full bg-red-200'>
                      <button
                        onClick={handleOpenPredict}
                        type='button'
                        className='btn btn-primary w-full'
                        disabled={!form.item_pkid || !form.quantity}
                      >
                        Prediksi Penjadwalan Produksi
                      </button>
                    </div>
                    <PredictTimeline
                      data={listPredict}
                      modal={openModalPredict}
                      setModal={setOpenModalPredict}
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

export default ModalProductionOrder;
