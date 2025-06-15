import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import PurchaseOrderDetailDataComponent from '@/components/apps/purchasing/purchasing_order/_components/item-purchase-order';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreatePurchaseOrder } from '@/app/api/hooks/purchasing/purchase_order/useCreatePurchaseOrder';
import { useGetPurchaseOrderByPkid } from '@/app/api/hooks/purchasing/purchase_order/useGetPurchaseOrderByPkid';
import { useUpdatePurchaseOrder } from '@/app/api/hooks/purchasing/purchase_order/useUpdatePurchaseOrder';
import { useGetPurchaseRequestByPkid } from '@/app/api/hooks/purchasing/purchase_request/useGetPurchaseRequestByPkid';
import { useGetPurchaseRequestForDropwdown } from '@/app/api/hooks/purchasing/purchase_request/useGetPurchaseRequestForDropwdown';
import { useGetSupplierForDropdown } from '@/app/api/hooks/purchasing/supplier/useGetSupplierForDropdown';
import {
  deliveryStatus,
  orderStatus,
  paymentStatus,
  purchaseOrderDetailInitialState,
  PurchaseOrderDetailProperty,
  purchaseOrderInitialState,
} from '@/helpers/utils/purchasing/purchase_order';
import { PurchaseRequestDetailProperty } from '@/helpers/utils/purchasing/purchase_request';

interface IModalPurchaseOrderProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
const ModalPurchaseOrder = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalPurchaseOrderProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const { mutateAsync: createPurchaseOrder } = useCreatePurchaseOrder();
  const { mutateAsync: updatePurchaseOrder } = useUpdatePurchaseOrder();
  const { data: listPurchaseRequest } = useGetPurchaseRequestForDropwdown();
  const { data: listSupplier } = useGetSupplierForDropdown();
  const [enabledDetailPurchaseRequest, setEnabledDetailPurchaseRequest] =
    useState(false);

  const [form, setForm] = useState(purchaseOrderInitialState);
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState<
    PurchaseOrderDetailProperty[]
  >(purchaseOrderDetailInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const { data: detailPurchaseRequest, isLoading: isLoadingPurchaseRequest } =
    useGetPurchaseRequestByPkid(
      form.purchase_request_id ?? 0,
      enabledDetailPurchaseRequest,
    );

  const {
    data: purchaseOrderDataDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetPurchaseOrderByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (purchaseOrderDataDetail && modalEdit && !isLoading) {
      setForm(purchaseOrderDataDetail);
      setPurchaseOrderDetail(purchaseOrderDataDetail.purchaseOrderDetails);
    }
  }, [purchaseOrderDataDetail, modalEdit, isLoading]);

  useEffect(() => {
    if (form.purchase_request_id && modal) {
      setEnabledDetailPurchaseRequest(true);
      if (detailPurchaseRequest && !isLoadingPurchaseRequest) {
        setForm(prevFrom => ({
          ...prevFrom,
          currency_code: detailPurchaseRequest.currency_code,
        }));
        setPurchaseOrderDetail(
          detailPurchaseRequest.purchaseRequestDetails.map(
            (item: PurchaseRequestDetailProperty) => ({
              item_pkid: item.item_pkid,
              quantity: item.quantity,
              description: item.description,
              currency_code: item.currency_code ?? '',
            }),
          ),
        );
      }
    }
  }, [
    form.purchase_request_id,
    modal,
    listPurchaseRequest,
    isLoadingPurchaseRequest,
    detailPurchaseRequest,
  ]);

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
      'delivery_status',
      'payment_status',
      'pkid',
      'code',
      'currency_code',
      'total_amount',
      'tenant_id',
    ] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    if (modalEdit) {
      requiredData.push('status', 'delivery_status', 'payment_status');
    }
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
    if (key.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(purchaseOrderInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(purchaseOrderInitialState);
      setPurchaseOrderDetail(purchaseOrderDetailInitialState);
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
            setForm(purchaseOrderInitialState);
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
                purchaseOrderDetails: purchaseOrderDetail,
              };

              await updatePurchaseOrder({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              const inputForm = {
                ...form,
                purchaseOrderDetails: purchaseOrderDetail,
              };
              await createPurchaseOrder(inputForm);
              setModal(false);
            }
            setForm(purchaseOrderInitialState);
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
  const handleDeletePurchaseOrderDetail = (index: number) => {
    const tempPurchaseOrderDetail = [...purchaseOrderDetail];
    tempPurchaseOrderDetail.splice(index, 1);
    setPurchaseOrderDetail(tempPurchaseOrderDetail);
  };
  const handleOnChangePurchaseOrderDetail = (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => {
    setPurchaseOrderDetail(
      purchaseOrderDetail.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(purchaseOrderInitialState);
      setPurchaseOrderDetail(purchaseOrderDetailInitialState);
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
                  {modal ? 'New' : 'Edit'} Purchase Order
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
                    <label htmlFor='purchase_request_id'>
                      Purchase Order Code
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='purchase_request_id'
                      name='purchase_request_id'
                      placeholder='Choose Purchase Request'
                      className='basic-single'
                      options={listPurchaseRequest?.map(
                        (item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.code,
                        }),
                      )}
                      isDisabled={modalEdit}
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
                            'purchase_request_id',
                          )
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'purchase_request_id',
                        )
                      }
                      value={
                        form.purchase_request_id
                          ? {
                              value: form.purchase_request_id ?? '',
                              label:
                                listPurchaseRequest?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.purchase_request_id,
                                )?.code ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='supplier_id'>
                      Supplir Name
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='supplier_id'
                      name='supplier_id'
                      placeholder='Choose Supplier'
                      className='basic-single'
                      options={listSupplier?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item.name,
                      }))}
                      isDisabled={modalEdit}
                      isSearchable={true}
                      isClearable={true}
                      maxMenuHeight={150}
                      menuPlacement='top'
                      styles={{
                        menu: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                        control: provided => ({
                          ...provided,
                          borderColor: emptyField.includes('supplier_id')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'supplier_id',
                        )
                      }
                      value={
                        form.supplier_id
                          ? {
                              value: form.supplier_id ?? '',
                              label:
                                listSupplier?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.supplier_id,
                                )?.name ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <div>
                      <label htmlFor='requested_date'>
                        Request Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='requested_date'
                        name='requested_date'
                        placeholder='Choose Date'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'requested_date')
                        }
                        disabled={modalEdit}
                        value={form.requested_date || ''}
                        style={{
                          borderColor: emptyField.includes('requested_date')
                            ? 'red'
                            : '',
                          cursor: modalEdit ? 'not-allowed' : 'pointer',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='order_date'>
                        Order Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='order_date'
                        name='order_date'
                        placeholder='Choose Date'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        disabled={modalEdit}
                        className='form-input'
                        onChange={date => handleOnChange(date[0], 'order_date')}
                        value={form.order_date || ''}
                        style={{
                          borderColor: emptyField.includes('order_date')
                            ? 'red'
                            : '',
                          cursor: modalEdit ? 'not-allowed' : 'pointer',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='delivery_date'>
                        Delivery Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='delivery_date'
                        name='delivery_date'
                        placeholder='Choose Date'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'delivery_date')
                        }
                        value={form.delivery_date || ''}
                        disabled={modalEdit}
                        style={{
                          borderColor: emptyField.includes('delivery_date')
                            ? 'red'
                            : '',
                          cursor: modalEdit ? 'not-allowed' : 'pointer',
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
                          Delivery Status
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
                  {isLoading || !purchaseOrderDetail ? (
                    <div className='flex items-center justify-center'>
                      Loading
                    </div>
                  ) : (
                    purchaseOrderDetail.map((item, index) => (
                      <div className='mb-4' key={index}>
                        <PurchaseOrderDetailDataComponent
                          key={index}
                          description={item.description}
                          quantity={item.quantity}
                          item_pkid={item.item_pkid}
                          handleDelete={() =>
                            handleDeletePurchaseOrderDetail(index)
                          }
                          handleOnChange={(value, key) =>
                            handleOnChangePurchaseOrderDetail(value, key, index)
                          }
                          index={index}
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

export default ModalPurchaseOrder;
