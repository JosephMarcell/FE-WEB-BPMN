import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import ItemRoutingComponent from '@/components/apps/manufacturing/master_data/routing/_components/item-routing';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { useBulkCreateRouting } from '@/app/api/hooks/manufacturing/routing/useBulkCreateRouting';
import { useGetAllRoutingByItemPkid } from '@/app/api/hooks/manufacturing/routing/useGetAllRoutingByItemPkid';
import { routingInitialState } from '@/helpers/utils/manufacturing/routing';
import { RoutingProperty } from '@/helpers/utils/manufacturing/routing';

interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
interface SelectedOption {
  value: string | number | boolean | Date | null | undefined;
  label: string;
}
interface IModalRegisterWorkCentreProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalRouting = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterWorkCentreProps) => {
  const { mutateAsync: bulkCreateRouting } = useBulkCreateRouting();
  const { data: listItem } = useGetAllItems();

  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState<RoutingProperty[]>([]);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const {
    data: routingDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAllRoutingByItemPkid(pkid, enabled);

  const handleAddRouting = () => {
    const tempForm = [...form];
    const objectData = {
      ...routingInitialState,
      order: tempForm.length + 1,
      item_pkid: selectedItem,
    };

    tempForm.push(objectData);
    setForm(tempForm);
  };

  const handleDeleteRouting = (index: number) => {
    const tempForm = [...form];
    tempForm.splice(index, 1);
    setForm(tempForm);
  };

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (routingDetail && modalEdit) {
      setForm(routingDetail);
      setSelectedItem(routingDetail[0].item_pkid as number | null);
    }
  }, [routingDetail, modalEdit]);

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
        // temp[field as keyof typeof temp] === '' ||
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
    index: number,
  ) => {
    setForm(
      form.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify([])) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm([]);
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
            setForm([]);
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
              // const tempForm = { ...form };
              // const formAfterDeletion = deleteBaseAttributes(tempForm);

              // await updateWorkCentre({
              //   pkid: pkid,
              //   data: formAfterDeletion,
              // });
              setModalEdit(false);
            }
            if (modal) {
              await bulkCreateRouting(form);
              setModal(false);
            }
            setForm([]);
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
      setForm([]);
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
                  {modal ? 'New' : 'Edit'} Routing
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
                      Item Produksi <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='item_pkid'
                      name='item_pkid'
                      placeholder='Pilih Item'
                      className='basic-single'
                      options={listItem?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item.name,
                      }))}
                      isSearchable={true}
                      isClearable={true}
                      maxMenuHeight={150}
                      menuPlacement='top'
                      menuPortalTarget={document.body}
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
                        menuPortal: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) => {
                        setSelectedItem(selectedOption?.value as number | null);
                        setForm([]);
                      }}
                      value={
                        selectedItem
                          ? {
                              value: selectedItem ?? '',
                              label:
                                listItem?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === selectedItem,
                                )?.name ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    {form.map((item, index) => (
                      <div className='mb-4' key={index}>
                        <ItemRoutingComponent
                          key={index}
                          name={item.name}
                          order={item.order}
                          operation_pkid={item.operation_pkid}
                          handleDelete={() => handleDeleteRouting(index)}
                          handleOnChange={(value, key) =>
                            handleOnChange(value, key, index)
                          }
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className='w-full bg-red-200'>
                      <button
                        onClick={handleAddRouting}
                        type='button'
                        className='btn btn-primary w-full'
                        disabled={!selectedItem}
                      >
                        Tambah routing
                      </button>
                    </div>
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

export default ModalRouting;
