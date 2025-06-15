import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCurrencyByDropdown } from '@/app/api/hooks/general_system/currency/useGetAllCurrencyByDropdown';
import { useGetAllTaxByDropdown } from '@/app/api/hooks/general_system/tax/useGetAllTaxByDropdown';
import { useCreateItem } from '@/app/api/hooks/inventory/items/item/useCreateItem';
import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';
import { useUpdateItem } from '@/app/api/hooks/inventory/items/item/useUpdateItem';
import { useGetAllUnitByDropdown } from '@/app/api/hooks/inventory/master_data/unit/useGetAllUnitByDropdown';
import { ItemProperty } from '@/helpers/utils/inventory/item/item';

const initialFormState: ItemProperty = {
  item_category_pkid: 6,
  unit_pkid: null,
  tax_pkid: null,
  currency_code: '',
  name: '',
  purchase_price: null,
  selling_price: null,
  description: '',
  sku: '',
  barcode: '',
  weight: null,
  dimensions: '',
};

interface IModalSparepartsProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface OptionType {
  value: string | number | null;
  label: string;
}

interface CurrencyOption {
  code: string;
  name: string;
}

interface TaxOption {
  pkid: number;
  name: string;
}

interface UnitOption {
  pkid: number;
  name: string;
}

const ModalSpareparts = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalSparepartsProps) => {
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const { data: currencyOptions, isLoading: isCurrencyLoading } =
    useGetAllCurrencyByDropdown();
  const { data: taxOptions, isLoading: isTaxLoading } =
    useGetAllTaxByDropdown();
  const { data: unitOptions, isLoading: isUnitLoading } =
    useGetAllUnitByDropdown();
  const { mutateAsync: createItem } = useCreateItem();
  const { mutateAsync: updateItem } = useUpdateItem();
  const { data: itemDetail, refetch: refetchItemDetail } =
    useGetItemByPkid(pkid);

  const [form, setForm] = useState<ItemProperty>(initialFormState);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const prevModalEdit = useRef(modalEdit);

  useEffect(() => {
    if (modalEdit) {
      refetchItemDetail();
    }
  }, [modalEdit, refetchItemDetail]);

  useEffect(() => {
    if (modalEdit && itemDetail) {
      setForm({
        ...itemDetail,
        weight: itemDetail.weight
          ? parseFloat(itemDetail.weight.toString())
          : null,
        dimensions: itemDetail.dimensions
          ? parseFloat(itemDetail.dimensions.toString())
          : '',
        purchase_price: itemDetail.purchase_price
          ? parseFloat(itemDetail.purchase_price.toString())
          : null,
        selling_price: itemDetail.selling_price
          ? parseFloat(itemDetail.selling_price.toString())
          : null,
      });
    }
  }, [modalEdit, itemDetail]);

  useEffect(() => {
    if (modal && !modalEdit && !prevModalEdit.current) {
      setForm(initialFormState);
    }
    prevModalEdit.current = modalEdit;
  }, [modal, modalEdit]); // Remove initialFormState from dependency array

  const handleClose = () => {
    if (modal) {
      setModal(false);
    }
    if (modalEdit) {
      setModalEdit(false);
    }
    setEmptyField([]); // Reset emptyField on close
  };

  const handleOnChange = (
    value: string | number | null,
    key: keyof ItemProperty,
  ) => {
    let newValue = value;
    if (typeof value === 'number') {
      newValue = parseFloat(value.toFixed(2));
    }
    setForm({ ...form, [key]: newValue });
  };

  const handleSelectChange = (
    selectedOption: SingleValue<OptionType>,
    key: keyof ItemProperty,
  ) => {
    setForm({ ...form, [key]: selectedOption ? selectedOption.value : null });
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof ItemProperty,
  ) => {
    const value = e.target.value.replace(/,/g, '');
    const numberValue = parseFloat(value);
    const formattedValue = isNaN(numberValue)
      ? ''
      : parseFloat(numberValue.toFixed(2));
    setForm({ ...form, [key]: formattedValue });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(initialFormState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(initialFormState);
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
            setForm(initialFormState);
            setEmptyField([]);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField: string[] = [];
    const nullableFields = [
      'tax_pkid',
      'purchase_price',
      'selling_price',
      'description',
      'sku',
      'barcode',
      'weight',
      'dimensions',
      'tenant_id',
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ];
    const requiredData = Object.keys(temp).filter(
      data => !nullableFields.includes(data),
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

  const handleSave = async () => {
    if (!mandatoryValidation()) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory fields',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }

    const formData: Omit<ItemProperty, 'pkid'> & { pkid?: number } = {
      ...form,
      purchase_price:
        form.purchase_price !== null && form.purchase_price !== undefined
          ? parseFloat(form.purchase_price.toString())
          : null,
      selling_price:
        form.selling_price !== null && form.selling_price !== undefined
          ? parseFloat(form.selling_price.toString())
          : null,
      weight:
        form.weight !== null && form.weight !== undefined
          ? parseFloat(form.weight.toString())
          : null,
      dimensions: form.dimensions || null,
      sku: form.sku || null,
      barcode: form.barcode || null,
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
          if (modalEdit && form.pkid) {
            await updateItem({ pkid: form.pkid, data: formData });
          } else {
            await createItem(formData);
          }
          Swal.fire({
            title: 'Success',
            text: 'Data has been saved!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          handleClose();
          refetch();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              Swal.fire({
                title: 'Error',
                text: `Failed to save data: ${
                  error.response.data.message || 'Internal Server Error'
                }`,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else if (error.request) {
              Swal.fire({
                title: 'Error',
                text: 'Failed to save data: No response received from server',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: `Failed to save data: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to save data:',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        }
      }
    });
  };

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
                <h5 className='text-lg font-bold'>
                  {modalEdit ? 'Edit Spareparts' : 'New Spareparts'}
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
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='itemName'>
                      Item Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='itemName'
                      name='itemName'
                      type='text'
                      placeholder='Enter item name...'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'name')}
                      value={form.name || ''}
                      style={{
                        borderColor:
                          !modalEdit && emptyField.includes('name')
                            ? 'red'
                            : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='purchasePrice'>Purchase Price </label>
                    <input
                      id='purchasePrice'
                      name='purchasePrice'
                      type='text'
                      placeholder='Enter purchase price...'
                      className='form-input'
                      onChange={e => handlePriceChange(e, 'purchase_price')}
                      value={
                        form.purchase_price !== null &&
                        form.purchase_price !== undefined
                          ? form.purchase_price.toString()
                          : ''
                      }
                      style={{
                        borderColor:
                          !modalEdit && emptyField.includes('purchase_price')
                            ? 'red'
                            : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='sellingPrice'>Selling Price </label>
                    <input
                      id='sellingPrice'
                      name='sellingPrice'
                      type='text'
                      placeholder='Enter selling price...'
                      className='form-input'
                      onChange={e => handlePriceChange(e, 'selling_price')}
                      value={
                        form.selling_price !== null &&
                        form.selling_price !== undefined
                          ? form.selling_price.toString()
                          : ''
                      }
                      style={{
                        borderColor:
                          !modalEdit && emptyField.includes('selling_price')
                            ? 'red'
                            : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='currency'>
                      Currency <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='currency'
                      name='currency'
                      options={currencyOptions?.map(
                        (option: CurrencyOption) => ({
                          value: option.code,
                          label: `${option.name} (${option.code})`,
                        }),
                      )}
                      placeholder='Select currency'
                      className='basic-single'
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'currency_code')
                      }
                      value={
                        form.currency_code
                          ? {
                              value: form.currency_code,
                              label:
                                currencyOptions?.find(
                                  (option: CurrencyOption) =>
                                    option.code === form.currency_code,
                                )?.name || '',
                            }
                          : null
                      }
                      isLoading={isCurrencyLoading}
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor:
                            !modalEdit && emptyField.includes('currency_code')
                              ? 'red'
                              : '',
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='taxType'>Tax Type</label>
                    <Select
                      id='taxType'
                      name='taxType'
                      options={[
                        { value: null, label: 'None' },
                        ...(taxOptions
                          ? taxOptions.map((option: TaxOption) => ({
                              value: option.pkid,
                              label: option.name,
                            }))
                          : []),
                      ]}
                      placeholder='Select tax type'
                      className='basic-single'
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'tax_pkid')
                      }
                      value={
                        form.tax_pkid
                          ? {
                              value: form.tax_pkid,
                              label:
                                taxOptions?.find(
                                  (option: TaxOption) =>
                                    option.pkid === form.tax_pkid,
                                )?.name || 'None',
                            }
                          : { value: null, label: 'None' }
                      }
                      isLoading={isTaxLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor='unit'>
                      Unit <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='unit'
                      name='unit'
                      options={unitOptions?.map((option: UnitOption) => ({
                        value: option.pkid,
                        label: option.name,
                      }))}
                      placeholder='Select unit'
                      className='basic-single'
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'unit_pkid')
                      }
                      value={
                        form.unit_pkid
                          ? {
                              value: form.unit_pkid,
                              label:
                                unitOptions?.find(
                                  (option: UnitOption) =>
                                    option.pkid === form.unit_pkid,
                                )?.name || '',
                            }
                          : null
                      }
                      isLoading={isUnitLoading}
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor:
                            !modalEdit && emptyField.includes('unit_pkid')
                              ? 'red'
                              : '',
                        }),
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='sku'>SKU</label>
                    <input
                      id='sku'
                      name='sku'
                      type='text'
                      placeholder='Enter SKU...'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'sku')}
                      value={form.sku || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor='barcode'>Barcode</label>
                    <input
                      id='barcode'
                      name='barcode'
                      type='text'
                      placeholder='Enter barcode...'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'barcode')}
                      value={form.barcode || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor='weight'>Weight</label>
                    <input
                      id='weight'
                      name='weight'
                      type='text'
                      placeholder='Enter weight...'
                      className='form-input'
                      onChange={e => handlePriceChange(e, 'weight')}
                      value={
                        form.weight !== null && form.weight !== undefined
                          ? form.weight.toString()
                          : ''
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='dimensions'>Dimensions</label>
                    <input
                      id='dimensions'
                      name='dimensions'
                      type='text'
                      placeholder='Enter dimensions...'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'dimensions')
                      }
                      value={form.dimensions || ''}
                    />
                  </div>
                </div>
                <div className='pt-4'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    // type='text'
                    placeholder='Enter description...'
                    className='form-input'
                    onChange={e =>
                      handleOnChange(e.target.value, 'description')
                    }
                    value={form.description || ''}
                  />
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
                    onClick={handleSave}
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

export default ModalSpareparts;
