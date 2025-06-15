import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { useCreateReceiveBuy } from '@/app/api/hooks/inventory/receive/useCRUDReceive';
import { useGetAllPurchase } from '@/app/api/hooks/purchasing/purchase_request/useCRUDPurchaseRequest';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import {
  FormGeneralReceiveBuy,
  formGeneralReceiveBuyInitialState,
  FormGeneralReceiveBuyItem,
  NewGeneralReceive,
  NewGeneralReceiveItem,
} from '@/helpers/utils/inventory/inventory_receive';
import { receiveType } from '@/helpers/utils/inventory/inventory_receive_item';
import {
  PurchaseDetailProperty,
  purchaseInitialState,
  PurchaseProperty,
} from '@/helpers/utils/purchasing/purchasing';

interface IModalNewReceiveProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalNewReceive = ({
  modal,
  setModal,
  refetch,
}: IModalNewReceiveProps) => {
  const { data: listPurchase } = useGetAllPurchase();
  const { mutateAsync: createReceiveBuy } = useCreateReceiveBuy();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [purchaseDropdown, setPurchaseDropdown] = useState(
    [] as SelectOptionProperty[],
  );

  useEffect(() => {
    if (listPurchase) {
      const purchase = listPurchase.map((item: PurchaseProperty) => {
        return {
          value: item.pkid,
          label: item.code,
        };
      });
      setPurchaseDropdown(purchase);
    }
  }, [listPurchase]);

  const [form, setForm] = useState(formGeneralReceiveBuyInitialState);

  const handlePurchaseChange = (value: SingleValue<SelectOptionProperty>) => {
    if (value) {
      const findData = listPurchase.find(
        (item: PurchaseProperty) => item.pkid === Number(value.value),
      ) as PurchaseProperty;
      if (findData) {
        setForm((prev: FormGeneralReceiveBuy) => ({
          ...prev,
          activity_target: findData.code || '',
          purchase_invoice: findData.invoice || '',
          buy_at: findData.createdAt || '',
          inventory_id: 1,
          Supplier: findData.Supplier || purchaseInitialState.Supplier,
          items: findData.PurchaseDetails.map(
            (item: PurchaseDetailProperty) => {
              const newItem: FormGeneralReceiveBuyItem = {
                item_id: item.pkid || 0,
                item_code: item.item || '',
                item_name: item.itemData.name || '',
                item_unit: item.itemData.unit || '',
                quantity: item.quantity || 0,
                accepted_quantity: item.quantity || 0,
                rejected_quantity: 0,
              };
              return newItem;
            },
          ) as FormGeneralReceiveBuyItem[],
        }));
      }
    }
  };

  const mandatoryValidation = () => {
    return true;
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
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
        text: 'Make sure all data is correct',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            setIsLoadingCreate(true);
            const rejectedReceiveData: NewGeneralReceive = {
              ...form,
              date: new Date().toISOString(),
              status: 'successed',
              type: 'purchase',
              activity_target: form.activity_target,
              is_rejected: true,
              inventory_id: form.inventory_id,
              items: form.items.map((item: FormGeneralReceiveBuyItem) => {
                if (item.rejected_quantity > 0) {
                  const newItem: NewGeneralReceiveItem = {
                    item_id: item.item_id,
                    quantity: item.rejected_quantity,
                  };
                  return newItem;
                }
              }) as NewGeneralReceiveItem[],
            };
            const acceptedReceiveData: NewGeneralReceive = {
              ...form,
              date: new Date().toISOString(),
              status: 'successed',
              type: 'purchase',
              activity_target: form.activity_target,
              is_rejected: false,
              inventory_id: form.inventory_id,
              items: form.items.map((item: FormGeneralReceiveBuyItem) => {
                if (item.accepted_quantity > 0) {
                  const newItem: NewGeneralReceiveItem = {
                    item_id: item.item_id,
                    quantity: item.accepted_quantity,
                  };
                  return newItem;
                }
              }) as NewGeneralReceiveItem[],
            };
            if (rejectedReceiveData.items.length > 0) {
              await createReceiveBuy(rejectedReceiveData);
            }
            if (acceptedReceiveData.items.length > 0) {
              await createReceiveBuy(acceptedReceiveData);
            }
            setIsLoadingCreate(false);
            setModal(false);
            setForm(formGeneralReceiveBuyInitialState);
            Swal.fire('Saved!', 'Your item has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
          } catch (error) {
            setIsLoadingCreate(false);
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(true)}>
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
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>Create Receive</h5>
                <button
                  onClick={() => setModal(false)}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='flex min-h-[40vh] flex-col justify-between p-5'>
                <div className='space-y-5'>
                  <div>
                    <label htmlFor='date'>Receive Type</label>
                    <Select
                      options={receiveType}
                      isSearchable={true}
                      isClearable={true}
                      className='basic-single'
                    />
                  </div>
                  <div className='flex gap-2'>
                    <div className='w-full'>
                      <label htmlFor='purchase_id'>
                        Choose Purchase <span className='text-red-500'>*</span>
                      </label>
                      <Select
                        options={purchaseDropdown}
                        onChange={handlePurchaseChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor='code'>Purchase Code</label>
                    <input
                      id='code'
                      name='code'
                      className='form-input'
                      value={form.activity_target || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor='invoice'>Invoice</label>
                    <input
                      id='invoice'
                      name='invoice'
                      className='form-input'
                      value={form.purchase_invoice || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor='createdAt'>Buy At</label>
                    <input
                      id='createdAt'
                      name='createdAt'
                      className='form-input'
                      value={form.buy_at || ''}
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor='supplier_id'>Supplier</label>
                    <input
                      id='supplier_id'
                      name='supplier_id'
                      className='form-input'
                      value={form.Supplier.name || ''}
                      disabled
                    />
                  </div>
                  <div className='table-responsive space-y-5'>
                    <table className='w-full table-auto'>
                      <thead>
                        <tr>
                          <th className='border'>Item Code</th>
                          <th className='border'>Item Name</th>
                          <th className='border'>Quantity Buy</th>
                          <th className='border'>Quantity Accepted</th>
                          <th className='border'>Quantity Rejected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.items.map((item: FormGeneralReceiveBuyItem) => {
                          return (
                            <tr key={item.item_id}>
                              <td className='border'>{item.item_code}</td>
                              <td className='border'>{item.item_name}</td>
                              <td className='border'>
                                {item.quantity + ' ' + item.item_unit}
                              </td>
                              <td className='border'>
                                <div className='flex items-center gap-2'>
                                  <input
                                    type='number'
                                    className='form-input'
                                    value={item.accepted_quantity}
                                    onChange={e => {
                                      const value = Number(e.target.value);
                                      setForm(
                                        (prev: FormGeneralReceiveBuy) => ({
                                          ...prev,
                                          items: prev.items.map(
                                            (
                                              item: FormGeneralReceiveBuyItem,
                                            ) => {
                                              if (
                                                item.item_id === item.item_id
                                              ) {
                                                return {
                                                  ...item,
                                                  accepted_quantity: value,
                                                };
                                              }
                                              return item;
                                            },
                                          ),
                                        }),
                                      );
                                    }}
                                  />
                                  <p>{item.item_unit}</p>
                                </div>
                              </td>
                              <td className='flex gap-2 border'>
                                <div className='flex items-center gap-2'>
                                  <input
                                    type='number'
                                    className='form-input'
                                    value={item.rejected_quantity}
                                    onChange={e => {
                                      const value = Number(e.target.value);
                                      setForm(
                                        (prev: FormGeneralReceiveBuy) => ({
                                          ...prev,
                                          items: prev.items.map(
                                            (
                                              item: FormGeneralReceiveBuyItem,
                                            ) => {
                                              if (
                                                item.item_id === item.item_id
                                              ) {
                                                return {
                                                  ...item,
                                                  rejected_quantity: value,
                                                };
                                              }
                                              return item;
                                            },
                                          ),
                                        }),
                                      );
                                    }}
                                  />
                                  <p>{item.item_unit}</p>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className='flex flex-row-reverse p-5'>
                {isLoadingCreate ? (
                  <button type='button' className='btn btn-primary !mt-6'>
                    <IconLoader className='inline-block shrink-0 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2' />
                    Loading
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='btn btn-primary !mt-6'
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalNewReceive;
