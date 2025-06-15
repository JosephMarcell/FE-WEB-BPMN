import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetItemByCategory } from '@/app/api/hooks/inventory/items/item/useGetItemByCategory';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useCreateInspectionProduct } from '@/app/api/hooks/manufacturing/inspection_product/useCreateInspectionProduct';
import { useGetInspectionProductByPkid } from '@/app/api/hooks/manufacturing/inspection_product/useGetInspectionProductByPkid';
import { useUpdateInspectionProduct } from '@/app/api/hooks/manufacturing/inspection_product/useUpdateInspectionProduct';
import {
  inspectionProductInitialState,
  itemRejectionInitialState,
  ItemRejectionProperty,
} from '@/helpers/utils/manufacturing/inspection_product';

import ItemRejectDataComponent from './item-reject-component';
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
interface IModalInspectionProductProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const orderStatus = [
  { value: 'approved', label: 'Approved' },
  { value: 'un_approved', label: 'Need Approval' },
  { value: 'rejected', label: 'Rejected' },
];
const ModalInspectionProduct = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalInspectionProductProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { mutateAsync: createInspectionProduct } = useCreateInspectionProduct();
  const { mutateAsync: updateInspectionProduct } = useUpdateInspectionProduct();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(inspectionProductInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [isHasReject, setIsHasReject] = useState(false);
  const [listRejectItem, setListRejectItem] = useState<ItemRejectionProperty[]>(
    itemRejectionInitialState,
  );
  const { data: listEndProducts } = useGetItemByCategory(1);
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();
  const {
    data: inspectionProductDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetInspectionProductByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (inspectionProductDetail && modalEdit) {
      setForm(inspectionProductDetail);
    }
  }, [inspectionProductDetail, modalEdit]);

  const handleAddRejectItem = () => {
    const tempRejectItem = [...listRejectItem];
    const objectData = {
      item_pkid: null,
      quantity: null,
    };

    tempRejectItem.push(objectData);
    setListRejectItem(tempRejectItem);
  };

  const handleDeletePurchaseRequestDetail = (index: number) => {
    const tempPurchaseRequestDetail = [...listRejectItem];
    tempPurchaseRequestDetail.splice(index, 1);
    setListRejectItem(tempPurchaseRequestDetail);
  };
  const handleOnChangePurchaseRequestDetail = (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => {
    setListRejectItem(
      listRejectItem.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
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
    if (
      JSON.stringify(form) === JSON.stringify(inspectionProductInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(inspectionProductInitialState);
      setEmptyField([]);
      setIsHasReject(false);
      setListRejectItem(itemRejectionInitialState);
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
            setForm(inspectionProductInitialState);
            setEmptyField([]);
            setIsHasReject(false);
            setListRejectItem(itemRejectionInitialState);
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
              const tempForm = {
                ...form,
                listRejectItem: listRejectItem,
              };

              await updateInspectionProduct({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createInspectionProduct(form);
              setModal(false);
            }
            setForm(inspectionProductInitialState);
            setEmptyField([]);
            setIsHasReject(false);
            setListRejectItem(itemRejectionInitialState);

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
  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(inspectionProductInitialState);
    }
    if (modal) {
      setModal(false);
    }
    setIsHasReject(false);
    setListRejectItem(itemRejectionInitialState);
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
                  {modal ? 'New' : 'Edit'} Inspection Product
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
                        Nama Item<span style={{ color: 'red' }}>*</span>
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
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='entry_date'>
                        Entry Date<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        // value={date1}
                        id='entry_date'
                        name='entry_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d-H:i:S',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date => handleOnChange(date[0], 'entry_date')}
                        value={form.entry_date || ''}
                        style={{
                          borderColor: emptyField.includes('entry_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='status'>
                        Status
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='status'
                        name='status'
                        placeholder='Choose Order Status'
                        className='basic-single'
                        options={orderStatus}
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
                            borderColor: emptyField.includes('status')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(selectedOption?.value || '', 'status')
                        }
                        value={
                          form.status
                            ? {
                                value: form.status ?? '',
                                label:
                                  orderStatus.find(
                                    (item: { value: string }) =>
                                      item.value === form.status,
                                  )?.label ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='quantity'>
                        Total Quantity Produced
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='quantity'
                        name='quantity'
                        type='text'
                        placeholder='Nama Kategory'
                        className='form-input'
                        onChange={e =>
                          handleOnChange(String(e.target.value), 'quantity')
                        }
                        value={form.quantity || 0}
                        style={{
                          borderColor: emptyField.includes('quantity')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='quantity_used'>
                        Total Quantity Accepted
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='quantity_used'
                        name='quantity_used'
                        type='text'
                        placeholder='Nama Kategory'
                        className='form-input'
                        onChange={e =>
                          handleOnChange(
                            String(e.target.value),
                            'quantity_used',
                          )
                        }
                        value={form.quantity_used || 0}
                        style={{
                          borderColor: emptyField.includes('quantity_used')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className='mt-1 flex cursor-pointer items-center'>
                      <span className='text-white-dark mr-2'>
                        Apakah Ada Item Reject ?{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </span>
                      <input
                        id='is_machine'
                        type='checkbox'
                        className='form-checkbox'
                        onChange={e => setIsHasReject(e.target.checked)}
                        checked={isHasReject}
                      />
                    </label>
                  </div>
                  {isHasReject && (
                    <>
                      <div>
                        <div className='w-full'>
                          <button
                            onClick={handleAddRejectItem}
                            type='button'
                            className='btn btn-primary w-full'
                          >
                            Tambah Item
                          </button>
                        </div>
                      </div>
                      {isLoading || !listRejectItem ? (
                        <div className='flex items-center justify-center'>
                          Loading
                        </div>
                      ) : (
                        listRejectItem.map((item, index) => (
                          <div className='mb-4' key={index}>
                            <ItemRejectDataComponent
                              key={index}
                              quantity={item.quantity}
                              item_pkid={item.item_pkid}
                              handleDelete={() =>
                                handleDeletePurchaseRequestDetail(index)
                              }
                              handleOnChange={(value, key) =>
                                handleOnChangePurchaseRequestDetail(
                                  value,
                                  key,
                                  index,
                                )
                              }
                              index={index}
                              length={listRejectItem.length}
                            />
                          </div>
                        ))
                      )}
                    </>
                  )}
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

export default ModalInspectionProduct;
