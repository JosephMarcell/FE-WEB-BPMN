import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { useCreateMachine } from '@/app/api/hooks/manufacturing/machine/useCreateMachine';
import { useGetMachineByPkid } from '@/app/api/hooks/manufacturing/machine/useGetMachineByPkid';
import { useUpdateMachineByPkid } from '@/app/api/hooks/manufacturing/machine/useUpdateMachine';
import { useGetAllWorkCentre } from '@/app/api/hooks/manufacturing/work_centre/useGetAllWorkCentre';
// import { AssetListProperty } from '@/helpers/utils/fixed_asset/asset_list';
import { sanitizedInputForPrice } from '@/helpers/utils/global/inputSanitizing';
import { machineInitialState } from '@/helpers/utils/manufacturing/machine';
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
interface IModalRegisterMachineProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
const ModalMachine = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterMachineProps) => {
  const { mutateAsync: createMachine } = useCreateMachine();
  const { mutateAsync: updateMachine } = useUpdateMachineByPkid();
  const { data: listAsset } = useGetAllAsset();
  const { data: listWorkCentre } = useGetAllWorkCentre();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(machineInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [customPrice, setCustomPrice] = useState(false as boolean);

  const {
    data: machineDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetMachineByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (machineDetail && modalEdit) {
      setForm(machineDetail);
    }
  }, [machineDetail, modalEdit]);

  useEffect(() => {
    if (form.asset_pkid && modal) {
      const selectedAsset = listAsset
        .find
        // (item: AssetListProperty) => item.pkid === form.asset_pkid,
        ();

      if (selectedAsset) {
        const calculatedCostPerHour =
          (selectedAsset.monthly_depreciation_tax ?? 0) /
          ((selectedAsset.actual_hours_per_day > 0
            ? selectedAsset.actual_hours_per_day
            : 1) *
            (selectedAsset.actual_days_per_week > 0
              ? selectedAsset.actual_days_per_week
              : 1));
        setForm(prevForm => ({
          ...prevForm,
          description: selectedAsset.name || '',
          cost_per_hour: calculatedCostPerHour || 0,
        }));
      } else {
        setForm(prevForm => ({
          ...prevForm,
          description: '',
          cost_per_hour: 0,
        }));
      }
    }
  }, [form.asset_pkid, listAsset, modal]);

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
      'waiting_time',
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

  const handleOnChange = (value: string | number, key: string) => {
    setForm(prevForm => ({ ...prevForm, [key]: value }));
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(machineInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(machineInitialState);
      setEmptyField([]);
      setCustomPrice(false);
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
            setForm(machineInitialState);
            setEmptyField([]);
            setCustomPrice(false);
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
              delete (tempForm as { waiting_time?: number }).waiting_time;
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateMachine({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createMachine(form);
              setModal(false);
            }
            setForm(machineInitialState);
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
      setForm(machineInitialState);
      setCustomPrice(false);
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
                  {modal ? 'New' : 'Edit'} Machine
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
                    <label htmlFor='asset_pkid'>
                      Nama Aset
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='asset_pkid'
                      name='asset_pkid'
                      placeholder='Pilih Work Centre'
                      className='basic-single'
                      options={listAsset?.map((item: OptionSelect) => ({
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
                          zIndex: 9999,
                        }),
                        control: provided => ({
                          ...provided,
                          borderColor: emptyField.includes('asset_pkid')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'asset_pkid',
                        )
                      }
                      value={
                        form.asset_pkid
                          ? {
                              value: form.asset_pkid ?? '',
                              label:
                                listAsset?.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.asset_pkid,
                                )?.name ?? '',
                            }
                          : null
                      }
                      isDisabled={modalEdit}
                    />
                  </div>
                  <div>
                    <label htmlFor='work_centre_pkid'>
                      Work Centre
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='work_centre_pkid'
                      name='work_centre_pkid'
                      placeholder='Pilih Metode Depresiasi'
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
                    <label className='mt-1 flex cursor-pointer items-center'>
                      <span className='text-white-dark mr-2'>
                        Apakah ingin Custom Biaya ?{' '}
                      </span>
                      <input
                        type='checkbox'
                        className='form-checkbox'
                        onChange={e =>
                          setCustomPrice(e.target.checked ? true : false)
                        }
                        checked={customPrice || false}
                      />
                    </label>
                  </div>
                  <div>
                    <label htmlFor='actual_hours_per_day'>
                      Biaya Per Jam
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='cost_per_hour'
                      name='cost_per_hour'
                      type='text'
                      disabled={!customPrice}
                      style={{
                        cursor: !customPrice ? 'not-allowed' : 'auto',
                        borderColor: emptyField.includes('cost_per_hour')
                          ? 'red'
                          : '',
                      }}
                      placeholder='Waktu penggunaan aset (jam)'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          sanitizedInputForPrice(e),
                          'cost_per_hour',
                        )
                      }
                      pattern='[0-9.]*'
                      value={form.cost_per_hour || ''}
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

export default ModalMachine;
