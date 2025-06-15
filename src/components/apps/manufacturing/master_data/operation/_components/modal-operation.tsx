import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { useGetAllMachine } from '@/app/api/hooks/manufacturing/machine/useGetAllMachine';
import { useGetAllMan } from '@/app/api/hooks/manufacturing/man/useGetAllMan';
import { useCreateOperation } from '@/app/api/hooks/manufacturing/operation/useCreateOperation';
import { useGetOperationByPkid } from '@/app/api/hooks/manufacturing/operation/useGetOperationByPkid';
import { useUpdateOperation } from '@/app/api/hooks/manufacturing/operation/useUpdateOperation';
import { useGetAllWorkCentre } from '@/app/api/hooks/manufacturing/work_centre/useGetAllWorkCentre';
import { operationInitialState } from '@/helpers/utils/manufacturing/operation';
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  description?: string | number;
  skill?: string | number;
}
interface SelectedOption {
  value: string | number | boolean | Date | null | undefined;
  label: string;
}
interface IModalRegisterOperationProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalOperation = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterOperationProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { mutateAsync: createOperation } = useCreateOperation();
  const { mutateAsync: updateOperation } = useUpdateOperation();
  const { data: listItem } = useGetAllItems();
  const { data: listManSkill } = useGetAllMan();
  const { data: listMachine } = useGetAllMachine();
  const { data: listWorkCentre } = useGetAllWorkCentre();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(operationInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const {
    data: operationDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetOperationByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (operationDetail && modalEdit) {
      setForm(operationDetail);
    }
  }, [operationDetail, modalEdit]);

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
    if (name.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }

    if (name.includes('hour') && value instanceof Date) {
      const date = new Date(value.toString());
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      value = `${hour}:${minute}:${second}`;
    }

    setForm({ ...form, [name]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(operationInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(operationInitialState);
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
            setForm(operationInitialState);
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
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateOperation({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createOperation(form);
              setModal(false);
            }
            setForm(operationInitialState);
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
      setForm(operationInitialState);
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
                  {modal ? 'New' : 'Edit'} Operation
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
                    <label htmlFor='name'>
                      Nama Operasi<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Nama Operasi'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'name')
                      }
                      value={form.name || ''}
                      style={{
                        borderColor: emptyField.includes('name') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='item_pkid'>
                      Pilih Item<span style={{ color: 'red' }}>*</span>
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
                        handleOnChange(selectedOption?.value || '', 'item_pkid')
                      }
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
                    />
                  </div>
                  <div>
                    <label htmlFor='description'>
                      Deskripsi<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='description'
                      name='description'
                      type='text'
                      placeholder='Lokasi Work Centre'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'description')
                      }
                      value={form.description || ''}
                      style={{
                        borderColor: emptyField.includes('description')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='item_max'>
                      Banyak Item per Produksi
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='item_max'
                      name='item_max'
                      type='text'
                      placeholder='Lokasi Work Centre'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'item_max')
                      }
                      value={form.item_max || ''}
                      style={{
                        borderColor: emptyField.includes('item_max')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='work_centre_pkid'>
                      Pilih Work Centre<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='work_centre_pkid'
                      name='work_centre_pkid'
                      placeholder='Pilih Work Centre'
                      className='basic-single'
                      options={listWorkCentre?.map((item: OptionSelect) => ({
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
                          borderColor: emptyField.includes('work_centre_pkid')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'work_centre_pkid',
                        )
                      }
                      value={
                        form.work_centre_pkid
                          ? {
                              value: form.work_centre_pkid ?? '',
                              label:
                                listWorkCentre?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.work_centre_pkid,
                                )?.name ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='machine_pkid'>
                      Pilih Mesin<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='machine_pkid'
                      name='machine_pkid'
                      placeholder='Pilih Mesin'
                      className='basic-single'
                      options={listMachine?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item?.description ?? '',
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
                          borderColor: emptyField.includes('machine_pkid')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'machine_pkid',
                        )
                      }
                      value={
                        form.machine_pkid
                          ? {
                              value: form.machine_pkid ?? '',
                              label:
                                listMachine?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.machine_pkid,
                                )?.description ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='man_skill_pkid'>
                      Pilih Man Skill<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='man_skill_pkid'
                      name='man_skill_pkid'
                      placeholder='Pilih Item'
                      className='basic-single'
                      options={listManSkill?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item.skill,
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
                          borderColor: emptyField.includes('man_skill_pkid')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'man_skill_pkid',
                        )
                      }
                      value={
                        form.man_skill_pkid
                          ? {
                              value: form.man_skill_pkid ?? '',
                              label:
                                listManSkill?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.man_skill_pkid,
                                )?.skill ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='machine_hour'>
                      Lama Produksi<span style={{ color: 'red' }}>*</span>
                    </label>

                    <Flatpickr
                      placeholder='Pilih Waktu'
                      options={{
                        noCalendar: true,
                        enableTime: true,
                        dateFormat: 'H:i:S',
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      value={form.machine_hour || ''}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'machine_hour')}
                    />
                  </div>
                  <div>
                    <label htmlFor='man_skill_quantity'>
                      Banyak Pekerja<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='man_skill_quantity'
                      name='man_skill_quantity'
                      type='text'
                      placeholder='Jumlah Pekerja'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          String(e.target.value),
                          'man_skill_quantity',
                        )
                      }
                      value={form.man_skill_quantity || ''}
                      style={{
                        borderColor: emptyField.includes('man_skill_quantity')
                          ? 'red'
                          : '',
                      }}
                    />
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

export default ModalOperation;
