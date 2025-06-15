import { Dialog, Transition } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import React, { Fragment, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import { ChangeEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { useGetAllBuyableItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { useCreatePurchaseRequest } from '@/app/api/hooks/purchasing/purchase_request/useCRUDPurchaseRequest';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import { ItemProperty } from '@/helpers/utils/inventory/inventory_item';
import {
  newPurchasingInitialState,
  NewPurchasingItemProperty,
  NewPurchasingProperty,
} from '@/helpers/utils/purchasing/purchasing';

interface IModalNewPurchaseRequestProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalNewPurchaseRequest = ({
  modal,
  setModal,
  refetch,
}: IModalNewPurchaseRequestProps) => {
  const { data: listBuyableItems } = useGetAllBuyableItems();
  const { mutateAsync: createPurchase } = useCreatePurchaseRequest();

  const [selectedItem, setSelectedItem] = useState<NewPurchasingItemProperty>();
  const [buyableItemsDropdown, setBuyableItemsDropdown] = useState(
    [] as SelectOptionProperty[],
  );
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  useEffect(() => {
    if (listBuyableItems) {
      const buyableItems = listBuyableItems.map((item: ItemProperty) => {
        return {
          value: item.code,
          label: item.code + ' - ' + item.name,
        };
      });
      setBuyableItemsDropdown(buyableItems);
    }
  }, [listBuyableItems]);
  const [form, setForm] = useState(newPurchasingInitialState);

  const handleSelectItem = (value: string) => {
    const findItem = listBuyableItems.find(
      (item: ItemProperty) => item.code === value,
    );
    const newItem = {
      pkid: findItem.pkid,
      code: findItem.code,
      name: findItem.name,
      price: findItem.buy_price,
      quantity: 1,
      unit_code: findItem.Unit.code,
      tax_percentage: findItem.Tax.percentage,
      total_price: findItem.buy_price,
    } as NewPurchasingItemProperty;
    setSelectedItem(newItem);
  };
  const handleAddItemToList = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!selectedItem) {
      Swal.fire({
        title: 'Item is empty',
        text: 'Please select an item to be purchased',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else if (
      form.items.find(
        (item: NewPurchasingItemProperty) => item.pkid === selectedItem.pkid,
      )
    ) {
      Swal.fire({
        title: 'Item already added',
        text: 'This item has been added to the list',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else if (selectedItem) {
      setForm({
        ...form,
        items: [...form.items, selectedItem],
        total_price: form.total_price + (selectedItem.total_price || 0),
      });
    }
  };
  const handleQuantityChange = (
    e: ChangeEvent<HTMLInputElement>,
    pkid: number,
  ) => {
    const findItem = form.items.find(
      (item: NewPurchasingItemProperty) => item.pkid === pkid,
    );
    setForm({
      ...form,
      items: form.items.map((item: NewPurchasingItemProperty) =>
        item.pkid === pkid
          ? {
              ...item,
              quantity: Number(e.target.value),
              total_price: Number(e.target.value) * (item.price || 0),
            }
          : item,
      ),
      total_price:
        form.total_price -
        (findItem?.total_price || 0) +
        Number(e.target.value) * (findItem?.price || 0),
    });
  };
  const handleDeleteItem = (pkid: number) => {
    const findItem = form.items.find(
      (item: NewPurchasingItemProperty) => item.pkid === pkid,
    );
    setForm({
      ...form,
      items: form.items.filter(
        (item: NewPurchasingItemProperty) => item.pkid !== pkid,
      ),
      total_price: form.total_price - (findItem?.total_price || 0),
    });
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (form.items.length === 0) {
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
                <h5 className='text-lg font-bold'>
                  Create New Purchase Request
                </h5>
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
                  <h5 className='col-span-2'>Pilih Item</h5>
                  <Select
                    className='col-span-3'
                    options={buyableItemsDropdown}
                    onChange={(e: SingleValue<SelectOptionProperty>) =>
                      handleSelectItem(e?.value as string)
                    }
                  />
                  <button
                    className='btn btn-outline-primary col-span-2'
                    onClick={handleAddItemToList}
                  >
                    pilih item
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

export default ModalNewPurchaseRequest;
