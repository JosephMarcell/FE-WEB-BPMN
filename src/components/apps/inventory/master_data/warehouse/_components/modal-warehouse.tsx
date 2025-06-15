import { Dialog, Transition } from '@headlessui/react';
import { isEmpty } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCityByProvince } from '@/app/api/hooks/general_system/location/useGetAllCityByProvince';
import { useGetAllCountry } from '@/app/api/hooks/general_system/location/useGetAllCountry';
import { useGetAllProvinceInIndonesia } from '@/app/api/hooks/general_system/location/useGetAllProvinceInIndonesia';
import { useCreateWarehouse } from '@/app/api/hooks/inventory/master_data/warehouse/useCreateWarehouse';
import { useGetWarehouseByPkid } from '@/app/api/hooks/inventory/master_data/warehouse/useGetWarehouseByPkid';
import { useUpdateWarehouse } from '@/app/api/hooks/inventory/master_data/warehouse/useUpdateWarehouse';
import {
  WarehouseInitialState,
  WarehouseProperty,
} from '@/helpers/utils/inventory/master_data/warehouse/warehouse';

interface IModalRegisterWarehouseProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
  provinceCode?: number;
}

const ModalWarehouse = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterWarehouseProps) => {
  const { mutateAsync: createWarehouse } = useCreateWarehouse();
  const { mutateAsync: updateWarehouse } = useUpdateWarehouse();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState<WarehouseProperty>(WarehouseInitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [enabled1, setEnabled1] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  const { data: listCountry } = useGetAllCountry();
  const { data: listProvinceInIndonesia } = useGetAllProvinceInIndonesia();
  const { data: listCityByProvince, refetch: refetchCity } =
    useGetAllCityByProvince(selectedProvince ?? 0, enabled1);
  const {
    data: WarehouseDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetWarehouseByPkid(pkid, enabled);

  useEffect(() => {
    if (!isEmpty(form.state) && form.country === 'Indonesia') {
      if (selectedProvince !== 0) {
        setEnabled1(true);
        refetchCity();
      } else {
        setEnabled1(false);
      }
    } else {
      setEnabled1(false);
    }
  }, [form.state, form.country, refetchCity, selectedProvince]);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();

      if (WarehouseDetail?.country === 'Indonesia') {
        const selectedProvince = listProvinceInIndonesia?.find(
          (item: { nama_provinsi: string }) =>
            item.nama_provinsi === WarehouseDetail?.state,
        );

        setSelectedProvince(
          selectedProvince ? selectedProvince.kode_provinsi : 0,
        );
      }
    }
  }, [
    pkid,
    modalEdit,
    isLoading,
    refetchDetail,
    WarehouseDetail,
    listProvinceInIndonesia,
  ]);

  useEffect(() => {
    if (WarehouseDetail && modalEdit) {
      setForm(WarehouseDetail);
    }
  }, [WarehouseDetail, modalEdit]);

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
      'contact_number', // Make contact_number nullable
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
      // alert(`Required fields: ${requiredField.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
    provinceCode?: number,
  ) => {
    if (name.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    if (name === 'country' && form.country !== 'Indonesia') {
      form.state = null;
      form.city = null;
    }
    if (name === 'state') {
      setSelectedProvince(provinceCode ?? null);
      form.city = null;
      if (value === null) {
        setEnabled1(false);
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(WarehouseInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(WarehouseInitialState);
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
            setForm(WarehouseInitialState);
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

              await updateWarehouse({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createWarehouse(form);
              setModal(false);
            }
            setForm(WarehouseInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your warehouse has been saved.',
              'success',
            ).then(() => {
              refetch();
            });
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
      setForm(WarehouseInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog as='div' open={modal || modalEdit} onClose={() => setModal(true)}>
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
                <h5 className='text-lg font-bold'>New Warehouse</h5>
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
                      Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Insert Name'
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
                    <label htmlFor='address'>
                      Address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='address'
                      name='address'
                      type='text'
                      placeholder='Insert Address'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'address')
                      }
                      value={form.address || ''}
                      style={{
                        borderColor: emptyField.includes('address')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <div>
                      <label htmlFor='country'>
                        Country<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='country'
                        placeholder='Choose Country'
                        name='country'
                        className='basic-single'
                        options={listCountry?.map(
                          (item: { country: string }) => ({
                            value: item.country,
                            label: item.country,
                          }),
                        )}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'country',
                          )
                        }
                        isSearchable={true}
                        isClearable={true}
                        value={
                          form.country
                            ? {
                                value: form.country ?? '',
                                label:
                                  listCountry?.find(
                                    (item: { country: string }) =>
                                      item.country === form.country,
                                  )?.country ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('country')
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
                      <label htmlFor='state'>
                        Province<span style={{ color: 'red' }}>*</span>
                      </label>
                      {form.country === 'Indonesia' ? (
                        <Select
                          id='state'
                          placeholder='Choose Province'
                          name='state'
                          className='basic-single'
                          options={listProvinceInIndonesia?.map(
                            (item: {
                              nama_provinsi: string;
                              kode_provinsi: number;
                            }) => ({
                              value: item.nama_provinsi,
                              label: item.nama_provinsi,
                              provinceCode: item.kode_provinsi,
                            }),
                          )}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || null,
                              'state',
                              selectedOption?.provinceCode,
                            )
                          }
                          isSearchable={true}
                          isClearable={true}
                          value={
                            form.state
                              ? {
                                  value: form.state ?? '',
                                  label:
                                    listProvinceInIndonesia?.find(
                                      (item: { nama_provinsi: string }) =>
                                        item.nama_provinsi === form.state,
                                    )?.nama_provinsi ?? '',
                                }
                              : null
                          }
                          menuPortalTarget={document.body}
                          styles={{
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes('state')
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
                      ) : (
                        <input
                          id='state'
                          name='state'
                          type='text'
                          placeholder='Province Name'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'state')
                          }
                          value={form.state || ''}
                          style={{
                            borderColor: emptyField.includes('state')
                              ? 'red'
                              : '',
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <label htmlFor='city'>
                        City<span style={{ color: 'red' }}>*</span>
                      </label>
                      {form.country === 'Indonesia' ? (
                        <Select
                          id='city'
                          placeholder='Choose City'
                          name='city'
                          className='basic-single'
                          options={listCityByProvince?.map(
                            (item: { nama_kota: string }) => ({
                              value: item.nama_kota,
                              label: item.nama_kota,
                            }),
                          )}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || null,
                              'city',
                            )
                          }
                          isSearchable={true}
                          isClearable={true}
                          value={
                            form.city
                              ? {
                                  value: form.city ?? '',
                                  label:
                                    listCityByProvince?.find(
                                      (item: { nama_kota: string }) =>
                                        item.nama_kota === form.city,
                                    )?.nama_kota ?? '',
                                }
                              : null
                          }
                          menuPortalTarget={document.body}
                          styles={{
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes('city')
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
                      ) : (
                        <input
                          id='city'
                          name='city'
                          type='text'
                          placeholder='City Name'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'city')
                          }
                          value={form.city || ''}
                          style={{
                            borderColor: emptyField.includes('city')
                              ? 'red'
                              : '',
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor='postal_code'>
                      Postal Code <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='postal_code'
                      name='postal_code'
                      type='text'
                      placeholder='Insert Postal Code'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'postal_code')
                      }
                      value={form.postal_code || ''}
                      style={{
                        borderColor: emptyField.includes('postal_code')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='contact_number'>Contact Number</label>
                    <input
                      id='contact_number'
                      name='contact_number'
                      type='text'
                      placeholder='Insert Contact Number'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'contact_number')
                      }
                      value={form.contact_number || ''}
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

export default ModalWarehouse;
