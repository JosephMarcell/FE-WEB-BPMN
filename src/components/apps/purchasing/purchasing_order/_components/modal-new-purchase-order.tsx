import { Dialog, Transition } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import React, { Fragment, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import { ChangeEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { useCreatePurchaseOrder } from '@/app/api/hooks/purchasing/purchase_order/useCRUDPurchaseOrder';
import { useGetAllPurchaseRequest } from '@/app/api/hooks/purchasing/purchase_request/useCRUDPurchaseRequest';
import { useGetAllSupplier } from '@/app/api/hooks/purchasing/supplier/useGetAllSupplier';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import {
  newPurchasingInitialState,
  NewPurchasingItemProperty,
  NewPurchasingProperty,
  PurchaseDetailProperty,
  PurchaseProperty,
} from '@/helpers/utils/purchasing/purchasing';
import { SupplierProperty } from '@/helpers/utils/purchasing/supplier';

interface IModalNewPurchaseOrderProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalNewPurchaseOrder = ({
  modal,
  setModal,
  refetch,
}: IModalNewPurchaseOrderProps) => {
  const { data: listPurchaseRequest } = useGetAllPurchaseRequest();
  const { data: listSuppliers } = useGetAllSupplier();
  const { mutateAsync: createPurchase } = useCreatePurchaseOrder();

  const [selectedPurchaseRequest, setSelectedPurchaseRequest] =
    useState<PurchaseProperty>();
  const [supplierDropdown, setSupplierDropdown] = useState(
    [] as SelectOptionProperty[],
  );
  const [purchaseRequestDropdown, setPurchaseRequestDropdown] = useState(
    [] as SelectOptionProperty[],
  );
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  useEffect(() => {
    if (listPurchaseRequest) {
      const purchaseRequest = listPurchaseRequest.map(
        (item: PurchaseProperty) => {
          const localDate = new Date(item.requested_at as string);
          return {
            value: item.pkid?.toString() as string,
            label:
              item.pkid?.toString() +
              ' - ' +
              localDate.toDateString() +
              ' - ' +
              localDate.toLocaleTimeString(),
          };
        },
      );
      setPurchaseRequestDropdown(purchaseRequest);
    }
    if (listSuppliers) {
      const suppliers = listSuppliers.map((item: SupplierProperty) => {
        return {
          value: item.pkid?.toString() as string,
          label: item.pkid?.toString() + ' - ' + item.name,
        };
      });
      setSupplierDropdown(suppliers);
    }
  }, [listPurchaseRequest, listSuppliers]);
  const [form, setForm] = useState(newPurchasingInitialState);

  const handleSelectPurchaseRequest = (value: string) => {
    const findPurchase = listPurchaseRequest?.find(
      (item: PurchaseProperty) => item?.pkid?.toString() == value,
    );
    setSelectedPurchaseRequest(findPurchase);
  };
  const handleConfirmPurchaseRequest = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (selectedPurchaseRequest?.pkid == form.purchase_id) {
      Swal.fire({
        title: 'Purchase Request already selected',
        text: 'This purchase request has been added to the list',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else if (selectedPurchaseRequest) {
      setForm({
        ...form,
        purchase_id: selectedPurchaseRequest.pkid,
        items: selectedPurchaseRequest.PurchaseDetails.map(
          (item: PurchaseDetailProperty) => {
            return {
              pkid: item.pkid,
              code: item.item,
              name: item.itemData.name,
              price: item.price,
              total_price: (item.price || 0) * (item.quantity || 0),
              quantity: item.quantity,
              unit_code: item.itemData.unit,
              tax_percentage: 0,
            };
          },
        ),
        total_price: selectedPurchaseRequest.PurchaseDetails.reduce(
          (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
          0,
        ),
      });
    }
  };
  const handleSupplierChange = (e: SingleValue<SelectOptionProperty>) => {
    setForm({
      ...form,
      supplier_id: e?.value ? Number(e.value) : null,
    });
  };
  const handleQuantityChange = (
    e: ChangeEvent<HTMLInputElement>,
    pkid: number,
  ) => {
    setForm({
      ...form,
      items: form.items.map((item: NewPurchasingItemProperty) => {
        if (item.pkid === pkid) {
          item.quantity = Number(e.target.value);
          item.total_price = (item.price || 0) * (item.quantity || 0);
        }
        return item;
      }),
      total_price: form.items.reduce(
        (acc, item) => acc + (item.total_price || 0),
        0,
      ),
    });
  };
  const handleDeleteItem = (pkid: number) => {
    setForm({
      ...form,
      items: form.items.filter(
        (item: NewPurchasingItemProperty) => item.pkid !== pkid,
      ),
      total_price:
        form.total_price -
        (form.items.find(
          (item: NewPurchasingItemProperty) => item.pkid === pkid,
        )?.total_price || 0),
    });
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (form.items.length === 0) {
      Swal.fire({
        title: 'Purchase Request is empty',
        text: 'Please select a purchase request',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else if (form.supplier_id === null) {
      Swal.fire({
        title: 'Supplier is empty',
        text: 'Please select a supplier',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else if (form.purchase_id === null) {
      Swal.fire({
        title: 'Item is empty',
        text: 'Please select at least one item to be purchased',
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
            await createPurchase(form as NewPurchasingProperty);
            setIsLoadingCreate(false);
            setModal(false);
            setForm(newPurchasingInitialState);
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
      <Dialog
        as='div'
        open={modal}
        onClose={() => {
          setForm(newPurchasingInitialState);
          setModal(true);
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
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>Create New Purchase Order</h5>
                <button
                  onClick={() => {
                    setForm(newPurchasingInitialState);
                    setModal(false);
                  }}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='flex min-h-[40vh] flex-col gap-2 p-5'>
                <div className='grid grid-cols-7 gap-2'>
                  <h5 className='col-span-2'>Choose Supplier</h5>
                  <Select
                    className='col-span-3'
                    options={supplierDropdown}
                    onChange={(e: SingleValue<SelectOptionProperty>) =>
                      handleSupplierChange(e)
                    }
                  />
                </div>
                <div className='grid grid-cols-7 gap-2'>
                  <h5 className='col-span-2'>Choose Purchase Request</h5>
                  <Select
                    className='col-span-3'
                    options={purchaseRequestDropdown}
                    onChange={(e: SingleValue<SelectOptionProperty>) =>
                      handleSelectPurchaseRequest(e?.value as string)
                    }
                  />
                  <button
                    className='btn btn-outline-primary col-span-2'
                    onClick={handleConfirmPurchaseRequest}
                  >
                    choose purchase
                  </button>
                </div>
                <div className='table-responsive space-y-5'>
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className='h-full'>
                      {form.items.map((data: NewPurchasingItemProperty) => {
                        return (
                          <tr key={data.pkid} className='h-fit'>
                            <td>{data.code}</td>
                            <td>{data.name}</td>
                            <td>{data.price}</td>
                            <td>
                              <input
                                type='number'
                                value={data.quantity as number}
                                onChange={e =>
                                  handleQuantityChange(e, data.pkid as number)
                                }
                              />
                              {' ' + data.unit_code}
                            </td>
                            <td>{data.total_price}</td>
                            <td>
                              <Tippy content='Delete Item'>
                                <button
                                  className='btn btn-outline-danger'
                                  onClick={() =>
                                    handleDeleteItem(data.pkid as number)
                                  }
                                >
                                  <IconX />
                                </button>
                              </Tippy>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Total Budget</th>
                        <th>{form.total_price}</th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
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

export default ModalNewPurchaseOrder;
