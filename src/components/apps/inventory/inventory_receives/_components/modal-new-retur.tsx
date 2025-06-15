import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { MouseEvent } from 'react';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { useCreateGeneralTransfer } from '@/app/api/hooks/inventory/transfer/useCRUDTransfer';
import { ItemReceiveState } from '@/helpers/utils/inventory/inventory_receive';
import { NewGeneralTransfer } from '@/helpers/utils/inventory/inventory_transfer';

interface IModalNewReturProps {
  modal: boolean;
  purchaseCode: string;
  itemReceives: ItemReceiveState[] | [];
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalNewRetur = ({
  modal,
  purchaseCode,
  itemReceives,
  setModal,
  refetch,
}: IModalNewReturProps) => {
  const { mutateAsync: createGeneralTransfer } = useCreateGeneralTransfer();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

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
            const newGeneralTransferData: NewGeneralTransfer = {
              activity_target: purchaseCode,
              type: 'purchase',
              status: 'on going',
              items: itemReceives.map((item: ItemReceiveState) => {
                return {
                  item_code: item.Item.code,
                  quantity_transfer: item.quantity,
                };
              }),
            };
            await createGeneralTransfer(newGeneralTransferData);
            setIsLoadingCreate(false);
            setModal(false);
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
                <h5 className='text-lg font-bold'>Create Purchase Retur</h5>
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
                    <label htmlFor='code'>Purchase Code</label>
                    <input
                      id='code'
                      name='code'
                      className='form-input'
                      value={purchaseCode || ''}
                      disabled
                    />
                  </div>
                  <div className='table-responsive space-y-5'>
                    <table className='w-full table-auto'>
                      <thead>
                        <tr>
                          <th className='border'>Item Code</th>
                          <th className='border'>Item Name</th>
                          <th className='border'>Quantity Rejected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemReceives.map(
                          (item: ItemReceiveState, index: number) => {
                            return (
                              <tr key={index}>
                                <td className='border'>{item.Item.code}</td>
                                <td className='border'>{item.Item.name}</td>
                                <td className='border'>
                                  {item.quantity + ' ' + item.Item.Unit.code}
                                </td>
                              </tr>
                            );
                          },
                        )}
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

export default ModalNewRetur;
