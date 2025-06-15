// import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateInventoryWarehouse } from '@/app/api/hooks/inventory/inventory_warehouse/useCreateInventoryWarehouse';
import { useGetInventoryWarehouseByPkid } from '@/app/api/hooks/inventory/inventory_warehouse/useGetInventoryWarehouseByPkid';
import { useGetAllItemForDropdown } from '@/app/api/hooks/inventory/items/item/useGetAllItemForDropdown';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { inventoryReceiveItemInitialState } from '@/helpers/utils/inventory/inventory_receive_item';
import { inventoryWarehouseInitialState } from '@/helpers/utils/inventory/inventory_warehouse';

interface IModalInventoryWarehouseProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
const ModalInventoryWarehouse = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalInventoryWarehouseProps) => {
  const { mutateAsync: createInventoryWarehouse } =
    useCreateInventoryWarehouse();
  const [form, setForm] = useState(inventoryWarehouseInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const { data: listItem } = useGetAllItemForDropdown();
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();
  const {
    data: inventoryWarehouseDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetInventoryWarehouseByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (inventoryWarehouseDetail && modalEdit) {
      setForm(inventoryWarehouseDetail);
    }
  }, [inventoryWarehouseDetail, modalEdit]);

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
    ];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );

    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
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

  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
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
              // const tempForm = { ...form };
              // const formAfterDeletion = deleteBaseAttributes(tempForm);

              // await updateAsset({
              //   pkid: pkid,
              //   data: formAfterDeletion,
              // });
              setModalEdit(false);
            }
            if (modal) {
              await createInventoryWarehouse(form);
              setModal(false);
            }
            setForm(inventoryWarehouseInitialState);
            setEmptyField([]);
            Swal.fire('Saved!', 'Your asset has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    if (name.includes('date') && value instanceof Date) {
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
      JSON.stringify(form) === JSON.stringify(inventoryReceiveItemInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(inventoryWarehouseInitialState);
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
            setForm(inventoryWarehouseInitialState);
            setEmptyField([]);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
    }
    if (modal) {
      setModal(false);
    }
  };

  return (
    <div>
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
                    {modal ? 'New' : 'Edit'} Inventory Warehouse
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
                      <label htmlFor='item_pkid'>
                        Item Name <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='item_pkid'
                        placeholder='Choose Item'
                        options={listItem?.map((item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.name,
                        }))}
                        isSearchable={true}
                        isClearable={true}
                        className='basic-single'
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'item_pkid',
                          )
                        }
                        menuPortalTarget={document.body}
                        value={
                          form.item_pkid
                            ? {
                                value: form.item_pkid ?? '',
                                label:
                                  listItem?.find(
                                    (item: OptionSelect) =>
                                      item.pkid === form.item_pkid,
                                  )?.name ?? '',
                              }
                            : null
                        }
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('item_pkid')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='warehouse_pkid'>
                        Warehouse <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='warehouse_pkid'
                        placeholder='Pilih Warehouse'
                        options={listWarehouse?.map((item: OptionSelect) => ({
                          value: item.pkid,
                          label: item.name,
                        }))}
                        isSearchable={true}
                        isClearable={true}
                        className='basic-single'
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'warehouse_pkid',
                          )
                        }
                        menuPortalTarget={document.body}
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
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('warehouse_pkid')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='quantity'>
                        Quantity <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='quantity'
                        name='quantity'
                        type='text'
                        placeholder='Item Quantity'
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
                    {/* <div>
                      <label htmlFor='description'>
                        Deskripsi <span style={{ color: 'red' }}>*</span>
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
                    </div> */}
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
    </div>
  );
};

export default ModalInventoryWarehouse;
