import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateUnit } from '@/app/api/hooks/inventory/master_data/unit/useCreateUnit';
import { useGetUnitByPkid } from '@/app/api/hooks/inventory/master_data/unit/useGetUnitByPkid';
import { useUpdateUnit } from '@/app/api/hooks/inventory/master_data/unit/useUpdateUnit';
import {
  UnitCategory,
  UnitInitialState,
  UnitProperty,
} from '@/helpers/utils/inventory/master_data/unit/unit';

interface IModalRegisterUnitProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

const ModalUnit = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterUnitProps) => {
  const { mutateAsync: createUnit } = useCreateUnit();
  const { mutateAsync: updateUnit } = useUpdateUnit();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState<UnitProperty>(UnitInitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);

  const {
    data: UnitDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetUnitByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      if (UnitDetail) {
        setForm({
          ...UnitDetail,
          conversion_factor:
            UnitDetail.conversion_factor !== null
              ? Number(UnitDetail.conversion_factor)
              : null, // Ensure it's a number or null
        });
      }
    }
  }, [pkid, modalEdit, UnitDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField: string[] = [];
    const excludeItemField = [
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
      'tenant_id',
      'description',
      'conversion_factor', // Make description and conversion_factor nullable
    ];
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    key: keyof UnitProperty,
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: UnitCategory; label: string }>,
    key: keyof UnitProperty,
  ) => {
    setForm({ ...form, [key]: selectedOption?.value ?? UnitCategory.WEIGHT });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(UnitInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(UnitInitialState);
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
            setForm(UnitInitialState);
            setEmptyField([]);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory fields',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }

    // Ensure conversion_factor is either a number or null
    const formData: UnitProperty = {
      ...form,
      conversion_factor:
        form.conversion_factor === null || form.conversion_factor === ''
          ? null
          : form.conversion_factor,
    };

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
            const tempForm = { ...formData };
            const formAfterDeletion = deleteBaseAttributes(tempForm);

            await updateUnit({
              pkid: pkid,
              data: formAfterDeletion,
            });
            setModalEdit(false);
          }
          if (modal) {
            await createUnit(formData);
            setModal(false);
          }
          setForm(UnitInitialState);
          setEmptyField([]);
          Swal.fire('Saved!', 'Your Unit has been saved.', 'success').then(
            () => {
              refetch();
            },
          );
        } catch (error) {
          await Swal.fire('Error!', 'Something went wrong', 'error');
        }
      }
    });
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(UnitInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  const categoryOptions = Object.values(UnitCategory).map(category => ({
    value: category,
    label: category,
  }));

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog as='div' open={modal || modalEdit} onClose={handleClose}>
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
                <h5 className='text-lg font-bold'>New Unit</h5>
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
                    <label htmlFor='code'>
                      Code <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='code'
                      name='code'
                      type='text'
                      placeholder='Insert Code'
                      className='form-input'
                      onChange={e => handleOnChange(e, 'code')}
                      value={form.code || ''}
                      disabled={modalEdit} // Disable if in edit mode
                      style={{
                        borderColor: emptyField.includes('code') ? 'red' : '',
                        backgroundColor: modalEdit ? '#d3d3d3' : '', // Add darker gray background when disabled
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='name'>
                      Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Insert Name'
                      className='form-input'
                      onChange={e => handleOnChange(e, 'name')}
                      value={form.name || ''}
                      style={{
                        borderColor: emptyField.includes('name') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='description'>Description</label>
                    <textarea
                      id='description'
                      name='description'
                      // type='text'
                      placeholder='Insert Description'
                      className='form-input'
                      onChange={e => handleOnChange(e, 'description')}
                      value={form.description || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor='symbol'>
                      Symbol <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='symbol'
                      name='symbol'
                      type='text'
                      placeholder='Insert Symbol'
                      className='form-input'
                      onChange={e => handleOnChange(e, 'symbol')}
                      value={form.symbol || ''}
                      style={{
                        borderColor: emptyField.includes('symbol') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='conversion_factor'>Conversion Factor</label>
                    <input
                      id='conversion_factor'
                      name='conversion_factor'
                      type='number'
                      placeholder='Insert Conversion Factor'
                      className='form-input'
                      onChange={e => handleOnChange(e, 'conversion_factor')}
                      value={
                        form.conversion_factor !== null
                          ? form.conversion_factor
                          : ''
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='base_unit'>
                      Base Unit <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='base_unit'
                      name='base_unit'
                      type='checkbox'
                      className='form-checkbox'
                      onChange={e => handleOnChange(e, 'base_unit')}
                      checked={form.base_unit || false}
                      style={{
                        borderColor: emptyField.includes('base_unit')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='category'>
                      Category <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='category'
                      name='category'
                      placeholder='Select Category'
                      className='basic-single'
                      options={categoryOptions}
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
                          borderColor: emptyField.includes('category')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'category')
                      }
                      value={
                        form.category
                          ? {
                              value: form.category,
                              label: form.category,
                            }
                          : {
                              value: UnitCategory.WEIGHT,
                              label: UnitCategory.WEIGHT,
                            }
                      }
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

export default ModalUnit;
