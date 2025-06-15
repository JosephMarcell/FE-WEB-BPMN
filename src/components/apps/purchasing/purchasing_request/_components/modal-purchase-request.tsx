import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import PurchaseRequestDetailDataComponent from '@/components/apps/purchasing/purchasing_request/_components/item-purchase-request';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import { useCreatePurchaseRequest } from '@/app/api/hooks/purchasing/purchase_request/useCreatePurchaseRequest';
import { useGetPurchaseRequestByPkid } from '@/app/api/hooks/purchasing/purchase_request/useGetPurchaseRequestByPkid';
import { useUpdatePurchaseRequest } from '@/app/api/hooks/purchasing/purchase_request/useUpdatePurchaseRequest';
import {
  approvalStatus,
  priority,
  purchaseRequestDetailInitialState,
  PurchaseRequestDetailProperty,
  purchaseRequestInitialState,
} from '@/helpers/utils/purchasing/purchase_request';

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
interface IModalPurchaseRequestProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalPurchaseRequest = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalPurchaseRequestProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(purchaseRequestInitialState);
  const [purchaseRequestDetail, setPurchaseRequestDetail] = useState<
    PurchaseRequestDetailProperty[]
  >(purchaseRequestDetailInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const { mutateAsync: createPurchaseRequest } = useCreatePurchaseRequest();
  const { mutateAsync: updatePurchaseRequest } = useUpdatePurchaseRequest();
  const {
    data: purchaseRequestDataDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetPurchaseRequestByPkid(pkid, enabled);
  const { data: listCurrency } = useGetAllCurrency();

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (purchaseRequestDataDetail && modalEdit) {
      setForm(purchaseRequestDataDetail);
      setPurchaseRequestDetail(
        purchaseRequestDataDetail.purchaseRequestDetails,
      );
    }
  }, [purchaseRequestDataDetail, modalEdit]);

  const handleAddPurchaseRequestDetail = () => {
    const tempPurchaseRequestDetail = [...purchaseRequestDetail];
    const objectData = {
      item_pkid: null,
      quantity: null,
      description: null,
      currency_code: form.currency_code,
    };

    tempPurchaseRequestDetail.push(objectData);
    setPurchaseRequestDetail(tempPurchaseRequestDetail);
  };
  const handleDeletePurchaseRequestDetail = (index: number) => {
    const tempPurchaseRequestDetail = [...purchaseRequestDetail];
    tempPurchaseRequestDetail.splice(index, 1);
    setPurchaseRequestDetail(tempPurchaseRequestDetail);
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
      'approval_status',
      'approval_date',
      'required_date',
      'attachment',
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
      setPurchaseRequestDetail(
        purchaseRequestDetail.map(item => ({
          ...item,
          currency_code: value as string,
        })),
      );
    }
    setForm({ ...form, [key]: value });
  };
  const handleOnChangePurchaseRequestDetail = (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => {
    setPurchaseRequestDetail(
      purchaseRequestDetail.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(purchaseRequestInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(purchaseRequestInitialState);
      setPurchaseRequestDetail(purchaseRequestDetailInitialState);
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
            setForm(purchaseRequestInitialState);
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
                purchaseRequestDetails: purchaseRequestDetail,
              };

              await updatePurchaseRequest({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              delete (form as { total_amount?: number }).total_amount;
              delete (form as { approval_date?: string }).approval_date;
              delete (form as { approval_status?: string }).approval_status;
              delete (form as { required_date?: string }).required_date;
              delete (form as { code?: string }).code;
              delete (form as { attachment?: string }).attachment;
              delete (form as { pkid?: number }).pkid;

              const inputForm = {
                ...form,
                purchaseRequestDetails: purchaseRequestDetail,
              };
              await createPurchaseRequest(inputForm);
              setModal(false);
            }
            setForm(purchaseRequestInitialState);
            setPurchaseRequestDetail(purchaseRequestDetailInitialState);
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
      setForm(purchaseRequestInitialState);
      setPurchaseRequestDetail(purchaseRequestDetailInitialState);
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
                  {modal ? 'New' : 'Edit'} Purchase Request
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
                    <div>
                      <label htmlFor='department'>
                        Departement <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='department'
                        name='department'
                        type='text'
                        placeholder='Department Name'
                        className='form-input'
                        onChange={e =>
                          handleOnChange(String(e.target.value), 'department')
                        }
                        value={form.department || ''}
                        style={{
                          borderColor: emptyField.includes('department')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='priority'>
                        Priority Level<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='priority'
                        name='priority'
                        placeholder='Priority Level'
                        className='basic-single'
                        options={priority}
                        menuPortalTarget={document.body}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'priority',
                          )
                        }
                        value={
                          form.priority
                            ? {
                                value: form.priority ?? '',
                                label:
                                  priority.find(
                                    (item: { label: string }) =>
                                      item.label === form.priority,
                                  )?.label ?? '',
                              }
                            : null
                        }
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('priority')
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
                      <label htmlFor='requested_date'>
                        Request Date <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='requested_date'
                        name='requested_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'requested_date')
                        }
                        value={form.requested_date || ''}
                        style={{
                          borderColor: emptyField.includes('requested_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>
                  {modalEdit && (
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <label htmlFor='approval_status'>
                          Approval Status<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='approval_status'
                          name='approval_status'
                          placeholder='Approval Status'
                          className='basic-single'
                          options={approvalStatus}
                          menuPortalTarget={document.body}
                          isSearchable={true}
                          isClearable={true}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || null,
                              'approval_status',
                            )
                          }
                          value={
                            form.approval_status
                              ? {
                                  value: form.approval_status ?? '',
                                  label:
                                    approvalStatus.find(
                                      (item: { label: string }) =>
                                        item.label === form.approval_status,
                                    )?.label ?? '',
                                }
                              : null
                          }
                          styles={{
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes('priority')
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
                        onClick={handleAddPurchaseRequestDetail}
                        type='button'
                        className='btn btn-primary w-full'
                      >
                        Tambah Item
                      </button>
                    </div>
                  </div>
                  {isLoading || !purchaseRequestDetail ? (
                    <div className='flex items-center justify-center'>
                      Loading
                    </div>
                  ) : (
                    purchaseRequestDetail.map((item, index) => (
                      <div className='mb-4' key={index}>
                        <PurchaseRequestDetailDataComponent
                          key={index}
                          description={item.description}
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
                          length={purchaseRequestDetail.length}
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

export default ModalPurchaseRequest;
