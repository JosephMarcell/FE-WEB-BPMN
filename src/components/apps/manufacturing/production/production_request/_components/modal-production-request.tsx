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

import { useGetItemByCategory } from '@/app/api/hooks/inventory/items/item/useGetItemByCategory';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useCreateProductionRequest } from '@/app/api/hooks/manufacturing/production_request/useCreateProductionRequest';
import { useGetProductionRequestByPkid } from '@/app/api/hooks/manufacturing/production_request/useGetProductionRequestByPkid';
import { useUpdateProductionRequest } from '@/app/api/hooks/manufacturing/production_request/useUpdateProductionRequest';
import { useGetPredictProduction } from '@/app/api/hooks/scheduling/manufacture_scheduling/useGetPredictProduction';
import { productionRequestInitialState } from '@/helpers/utils/manufacturing/production_request';
import { PredictResultProperty } from '@/helpers/utils/scheduling/predict';
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}

interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
interface IModalRegisterProductionRequestProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

const ModalProductionRequest = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterProductionRequestProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { mutateAsync: createProductionRequest } = useCreateProductionRequest();
  const { mutateAsync: updateProductionRequest } = useUpdateProductionRequest();
  const { mutateAsync: getPredictProduction } = useGetPredictProduction();
  const { data: listEndProducts } = useGetItemByCategory(1);
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(productionRequestInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [openModalPredict, setOpenModalPredict] = useState(false);
  const [listPredict, setListPredict] = useState<PredictResultProperty[]>([]);
  const {
    data: productionRequestDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetProductionRequestByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (productionRequestDetail && modalEdit) {
      setForm(productionRequestDetail);
    }
  }, [productionRequestDetail, modalEdit]);

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
      'sales_order_pkid',
      'status',
      'end',
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
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    setForm({ ...form, [name]: value });
  };
  const handleCancel = () => {
    if (
      JSON.stringify(form) === JSON.stringify(productionRequestInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(productionRequestInitialState);
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
            setForm(productionRequestInitialState);
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
            delete (form as unknown as { status?: number }).status;
            delete (form as unknown as { sales_order_pkid?: number })
              .sales_order_pkid;
            if (modalEdit) {
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateProductionRequest({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createProductionRequest(form);
              setModal(false);
            }
            setForm(productionRequestInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your category has been saved.',
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
      setForm(productionRequestInitialState);
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
                  {modal ? 'New' : 'Edit'} Production Request
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
                      Tanggal Mulai Produksi{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      // value={date1}
                      id='start'
                      name='start'
                      placeholder='Pilih Tanggal'
                      options={{
                        enableTime: true,
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
                    <label htmlFor='quantity'>
                      Quantity<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='quantity'
                      name='quantity'
                      type='text'
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

export default ModalProductionRequest;
