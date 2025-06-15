import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import SalesOrderDetailDataComponent from '@/components/apps/sales/sales_order/_components/item-sales-order';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import { useGetCustomerForDropdown } from '@/app/api/hooks/sales/customer/useGetCustomerForDropdown';
import { useCreateSalesOrder } from '@/app/api/hooks/sales/sales_order/useCreateSalesOrder';
import { useGetSalesOrderByPkid } from '@/app/api/hooks/sales/sales_order/useGetSalesOrderByPkid';
import { useUpdateSalesOrder } from '@/app/api/hooks/sales/sales_order/useUpdateSalesOrder';
import {
  deliveryStatus,
  orderStatus,
  paymentStatus,
  salesOrderDetailInitialState,
  SalesOrderDetailProperty,
  salesOrderInitialState,
} from '@/helpers/utils/sales/sales';

interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
  code: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
interface IModalSalesOrderProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalSalesOrder = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalSalesOrderProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(salesOrderInitialState);
  const [salesOrderDetail, setSalesOrderDetail] = useState<
    SalesOrderDetailProperty[]
  >(salesOrderDetailInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const { mutateAsync: createSalesOrder } = useCreateSalesOrder();
  const { mutateAsync: updateSalesOrder } = useUpdateSalesOrder();
  const {
    data: salesOrderDataDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetSalesOrderByPkid(pkid, enabled);
  const { data: listCurrency } = useGetAllCurrency();
  const { data: listCustomer } = useGetCustomerForDropdown();

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (salesOrderDataDetail && modalEdit) {
      setForm(salesOrderDataDetail);
      setSalesOrderDetail(salesOrderDataDetail.salesOrderDetails);
    }
  }, [salesOrderDataDetail, modalEdit]);

  const handleAddSalesOrderDetail = () => {
    const tempSalesOrderDetail = [...salesOrderDetail];
    const objectData = {
      item_pkid: null,
      quantity: null,
      description: null,
      currency_code: form.currency_code,
    };

    tempSalesOrderDetail.push(objectData);
    setSalesOrderDetail(tempSalesOrderDetail);
  };
  const handleDeleteSalesOrderDetail = (index: number) => {
    const tempSalesOrderDetail = [...salesOrderDetail];
    tempSalesOrderDetail.splice(index, 1);
    setSalesOrderDetail(tempSalesOrderDetail);
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
      'pkid',
      'code',
      'status',
      'delivery_status',
      'payment_status',
      'total_amount',
      'tenant_id',
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
    key: string,
  ) => {
    if (key.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }

    if (key === 'currency_code') {
      setSalesOrderDetail(
        salesOrderDetail.map(item => ({
          ...item,
          currency_code: value as string,
        })),
      );
    }
    setForm({ ...form, [key]: value });
  };
  const handleOnChangeSalesOrderDetail = (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => {
    setSalesOrderDetail(
      salesOrderDetail.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(salesOrderInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(salesOrderInitialState);
      setSalesOrderDetail(salesOrderDetailInitialState);
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
            setForm(salesOrderInitialState);
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
              const tempForm = {
                ...form,
                salesOrderDetails: salesOrderDetail,
              };

              await updateSalesOrder({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              delete (form as { total_amount?: number }).total_amount;
              delete (form as { payment_status?: string }).payment_status;
              delete (form as { delivery_status?: string }).delivery_status;
              delete (form as { status?: string }).status;
              delete (form as { code?: string }).code;
              delete (form as { attachment?: string }).attachment;
              delete (form as { pkid?: number }).pkid;

              const inputForm = {
                ...form,
                salesOrderDetails: salesOrderDetail,
              };
              await createSalesOrder(inputForm);
              setModal(false);
            }
            setForm(salesOrderInitialState);
            setSalesOrderDetail(salesOrderDetailInitialState);
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
  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(salesOrderInitialState);
      setSalesOrderDetail(salesOrderDetailInitialState);
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
                  {modal ? 'New' : 'Edit'} Sales Order
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
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='customer_id'>
                        Customer Name<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='customer_id'
                        name='customer_id'
                        placeholder='Customer Name'
                        className='basic-single'
                        options={listCustomer?.map((item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.name,
                        }))}
                        isDisabled={modalEdit}
                        menuPortalTarget={document.body}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'customer_id',
                          )
                        }
                        value={
                          form.customer_id
                            ? {
                                value: form.customer_id ?? '',
                                label:
                                  listCustomer?.find(
                                    (item: OptionSelect) =>
                                      item.pkid === form.customer_id,
                                  )?.name ?? '',
                              }
                            : null
                        }
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('customer_id')
                              ? 'red'
                              : '',
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='currency_code'>
                        Currency<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='currency_code'
                        name='currency_code'
                        placeholder='Currency Code'
                        className='basic-single'
                        options={listCurrency?.map((item: OptionSelect) => ({
                          value: item.code,
                          label: item.name,
                        }))}
                        isDisabled={modalEdit}
                        menuPortalTarget={document.body}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'currency_code',
                          )
                        }
                        value={
                          form.currency_code
                            ? {
                                value: form.currency_code ?? '',
                                label:
                                  listCurrency?.find(
                                    (item: OptionSelect) =>
                                      item.code === form.currency_code,
                                  )?.name ?? '',
                              }
                            : null
                        }
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('currency_code')
                              ? 'red'
                              : '',
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='order_date'>
                        Order Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='order_date'
                        name='order_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date => handleOnChange(date[0], 'order_date')}
                        value={form.order_date || ''}
                        style={{
                          borderColor: emptyField.includes('order_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='delivery_date'>
                        Deliver Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='delivery_date'
                        name='delivery_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'delivery_date')
                        }
                        value={form.delivery_date || ''}
                        style={{
                          borderColor: emptyField.includes('delivery_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>
                  {modalEdit && (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                      <div>
                        <label htmlFor='status'>
                          Order Status
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
                            handleOnChange(
                              selectedOption?.value || '',
                              'status',
                            )
                          }
                          value={
                            form.status
                              ? {
                                  value: form.status ?? '',
                                  label:
                                    orderStatus.find(
                                      (item: { label: string }) =>
                                        item.label === form.status,
                                    )?.label ?? '',
                                }
                              : null
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor='delivery_status'>
                          Deliver Status
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='delivery_status'
                          name='delivery_status'
                          placeholder='Choose Deliver Status'
                          className='basic-single'
                          options={deliveryStatus}
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
                                'delivery_status',
                              )
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || '',
                              'delivery_status',
                            )
                          }
                          value={
                            form.delivery_status
                              ? {
                                  value: form.delivery_status ?? '',
                                  label:
                                    deliveryStatus.find(
                                      (item: { label: string }) =>
                                        item.label === form.delivery_status,
                                    )?.label ?? '',
                                }
                              : null
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor='payment_status'>
                          Payment Status
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='payment_status'
                          name='payment_status'
                          placeholder='Choose Payment Status'
                          className='basic-single'
                          options={paymentStatus}
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
                              borderColor: emptyField.includes('payment_status')
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || '',
                              'payment_status',
                            )
                          }
                          value={
                            form.payment_status
                              ? {
                                  value: form.payment_status ?? '',
                                  label:
                                    paymentStatus.find(
                                      (item: { label: string }) =>
                                        item.label === form.payment_status,
                                    )?.label ?? '',
                                }
                              : null
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor='description'>
                      Description <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      rows={3}
                      className='form-textarea'
                      placeholder='Enter Description'
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
                  <div>
                    <div className='w-full'>
                      <button
                        onClick={handleAddSalesOrderDetail}
                        type='button'
                        className='btn btn-primary w-full'
                      >
                        Tambah Item
                      </button>
                    </div>
                  </div>
                  {isLoading || !salesOrderDetail ? (
                    <div className='flex items-center justify-center'>
                      Loading
                    </div>
                  ) : (
                    salesOrderDetail.map((item, index) => (
                      <div className='mb-4' key={index}>
                        <SalesOrderDetailDataComponent
                          key={index}
                          description={item.description}
                          quantity={item.quantity}
                          item_pkid={item.item_pkid}
                          handleDelete={() =>
                            handleDeleteSalesOrderDetail(index)
                          }
                          handleOnChange={(value, key) =>
                            handleOnChangeSalesOrderDetail(value, key, index)
                          }
                          index={index}
                          length={salesOrderDetail.length}
                        />
                      </div>
                    ))
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

export default ModalSalesOrder;
