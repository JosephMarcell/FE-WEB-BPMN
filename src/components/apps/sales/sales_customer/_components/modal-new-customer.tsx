import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { useCreateItem } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { useGetAllCategories } from '@/app/api/hooks/inventory/items/useGetAllCategories';
import { useGetAllTax } from '@/app/api/hooks/inventory/items/useGetAllTax';
import { useGetAllUnits } from '@/app/api/hooks/inventory/items/useGetAllUnits';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import {
  itemInitialState,
  ItemProperty,
  TaxItemProperty,
  UnitItemProperty,
} from '@/helpers/utils/inventory/inventory_item';
import { ItemCategoryProperty } from '@/helpers/utils/inventory/inventory_item_category';

interface IModalNewCustomerProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalNewCustomer = ({
  modal,
  setModal,
  refetch,
}: IModalNewCustomerProps) => {
  const { data: listCategory } = useGetAllCategories();
  const { data: listUnit } = useGetAllUnits();
  const { data: listTax } = useGetAllTax();
  const { mutateAsync: createItem } = useCreateItem();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const [categoryDropdown, setCategoryDropdown] = useState(
    [] as SelectOptionProperty[],
  );
  const [unitDropdown, setUnitDropdown] = useState(
    [] as SelectOptionProperty[],
  );
  const [taxDropdown, setTaxDropdown] = useState([] as SelectOptionProperty[]);

  useEffect(() => {
    if (listCategory) {
      const category = listCategory.map((item: ItemCategoryProperty) => {
        return {
          value: item.pkid,
          label: item.name,
        };
      });
      setCategoryDropdown(category);
    }
    if (listUnit) {
      const unit = listUnit.map((item: UnitItemProperty) => {
        return {
          value: item.pkid,
          label: item.code,
        };
      });
      setUnitDropdown(unit);
    }
    if (listTax) {
      const tax = listTax.map((item: TaxItemProperty) => {
        return {
          value: item.pkid,
          label: item.name + ' (' + item.percentage + '%)',
        };
      });
      setTaxDropdown(tax);
    }
  }, [listCategory, listUnit, listTax]);

  const [emptyField, setEmptyField] = useState([] as string[]);
  const [form, setForm] = useState(itemInitialState);

  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (value: SingleValue<SelectOptionProperty>) => {
    if (value) {
      setForm({ ...form, category_id: Number(value.value) });
    }
  };
  const handleUnitChange = (value: SingleValue<SelectOptionProperty>) => {
    if (value) {
      setForm({ ...form, unit_id: Number(value.value) });
    }
  };
  const handleTaxChange = (value: SingleValue<SelectOptionProperty>) => {
    if (value) {
      setForm({ ...form, tax_id: Number(value.value) });
    }
  };

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = ['description'];
    if (form.category_id === 1) {
      excludeItemField.push('buy_price');
    } else if (form.category_id === 2) {
      excludeItemField.push('sale_price');
    } else if (form.category_id === 3) {
      excludeItemField.push('buy_price');
      excludeItemField.push('sale_price');
    }
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === null
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
            await createItem(form as ItemProperty);
            setIsLoadingCreate(false);
            setModal(false);
            setForm(itemInitialState);
            setEmptyField([]);
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
                <h5 className='text-lg font-bold'>Create New Item</h5>
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
                  <div className='flex gap-2'>
                    <div className='w-full'>
                      <label htmlFor='name'>
                        Nama Item <span className='text-red-500'>*</span>
                      </label>
                      <input
                        id='name'
                        name='name'
                        type='text'
                        placeholder='contoh: Gula Merah'
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
                    <div className='w-full'>
                      <label htmlFor='category_id'>
                        Tipe Item <span className='text-red-500'>*</span>
                      </label>
                      <Select
                        defaultValue={categoryDropdown[0]}
                        options={categoryDropdown}
                        isSearchable={false}
                        onChange={handleCategoryChange}
                        value={
                          categoryDropdown.find(
                            (item: SelectOptionProperty) =>
                              item.value == form.category_id?.toString(),
                          ) || categoryDropdown[0]
                        }
                      />
                    </div>
                  </div>
                  <div className='grid w-full grid-cols-7 gap-2'>
                    {form.category_id === 1 && (
                      <div className='col-span-5'>
                        <label htmlFor='name'>
                          Harga Jual Barang{' '}
                          <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex'>
                          <div className='border-white-light flex items-center justify-center border bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]'>
                            Rp.
                          </div>
                          <input
                            id='sale_price'
                            name='sale_price'
                            type='text'
                            placeholder='contoh: 20000'
                            className='form-input rounded-l-none'
                            onChange={e =>
                              handleOnChange(
                                String(e.target.value),
                                'sale_price',
                              )
                            }
                            value={form.sale_price || ''}
                            style={{
                              borderColor: emptyField.includes('sale_price')
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {form.category_id === 2 && (
                      <div className='col-span-5'>
                        <label htmlFor='name'>
                          Harga Beli Barang{' '}
                          <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex'>
                          <div className='border-white-light flex items-center justify-center border bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]'>
                            Rp.
                          </div>
                          <input
                            id='buy_price'
                            name='buy_price'
                            type='number'
                            placeholder='contoh: 20000'
                            className='form-input rounded-l-none'
                            onChange={e =>
                              handleOnChange(
                                String(e.target.value),
                                'buy_price',
                              )
                            }
                            value={form.buy_price || ''}
                            style={{
                              borderColor: emptyField.includes('buy_price')
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className='col-span-2'>
                      <label htmlFor='unit_id'>
                        Satuan <span className='text-red-500'>*</span>
                      </label>
                      <Select
                        defaultValue={unitDropdown[0]}
                        options={unitDropdown}
                        isSearchable={false}
                        onChange={handleUnitChange}
                        value={
                          unitDropdown.find(
                            (item: SelectOptionProperty) =>
                              item.value == form.unit_id?.toString(),
                          ) || unitDropdown[0]
                        }
                      />
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <label htmlFor='tax_id'>
                      Tipe Pajak <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      defaultValue={taxDropdown[0]}
                      options={taxDropdown}
                      isSearchable={false}
                      onChange={handleTaxChange}
                      value={
                        taxDropdown.find(
                          (item: SelectOptionProperty) =>
                            item.value == form.tax_id?.toString(),
                        ) || taxDropdown[0]
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='name'>Deskripsi Item</label>
                    <textarea
                      id='description'
                      name='description'
                      placeholder='masukkan deskripsi item disini...'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'description')
                      }
                      value={form.description || ''}
                    />
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

export default ModalNewCustomer;
