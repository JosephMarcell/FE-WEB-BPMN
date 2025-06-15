import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { Option } from '@/lib/view';
import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllEmployee } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useGetPresenceBlueByPkid } from '@/app/api/hooks/hrm/presence_blue/useGetPresenceBlueByPkid';
import { useUpdatePresenceBlue } from '@/app/api/hooks/hrm/presence_blue/useUpdatePresenceBlue';
import {
  presenceBlueInitialState,
  PresenceBlueProperty,
} from '@/helpers/utils/hrm/presence_blue';

interface IModalPresenceBlueProps {
  modal: boolean;
  pkid: number;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const optionsStatus = [
  { value: 'Hadir', label: 'Hadir' },
  { value: 'Izin', label: 'Izin' },
];

const ModalPresenceBlue = ({
  modal,
  pkid,
  setModal,
  refetch,
}: IModalPresenceBlueProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const { data: employeeData } = useGetAllEmployee();
  const { mutateAsync: updatePresenceBlue } = useUpdatePresenceBlue();
  const {
    data: presenceDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetPresenceBlueByPkid(pkid);

  const [form, setForm] = useState(presenceBlueInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const handleSelectChange = (
    value: Option | null,
    field: keyof PresenceBlueProperty,
  ) => {
    setForm({ ...form, [field]: value?.value });
  };

  useEffect(() => {
    if (pkid && modal && !isLoading) {
      refetchDetail();
      const data = presenceDetail as PresenceBlueProperty;
      setForm({
        ...data,
        presence: data?.presence === 'Alfa' ? 'Hadir' : data?.presence,
      });
    }
  }, [pkid, modal, presenceDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'check_out',
      'event_description',
      'date',
      'check_in',
      'updated_by',
      'updated_date',
      'updated_host',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ] as string[];
    excludeItemField.push('pkid');
    if (form.presence === 'Izin') {
      excludeItemField.push('actual_check_in', 'actual_check_out');
    }
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
      alert(`Required fields: ${requiredField.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleOnChange = (value: string | number | Date, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(presenceBlueInitialState)) {
      if (modal) {
        setModal(false);
      }
      setForm(presenceBlueInitialState);
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
            if (modal) {
              setModal(false);
            }
            setForm(presenceBlueInitialState);
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
            if (
              new Date(form.actual_check_in || 0) >
              new Date(form.actual_check_out || 0)
            ) {
              Swal.fire({
                title: 'Error!',
                text: 'Actual Check In cannot be greater than Actual Check Out',
                icon: 'error',
                confirmButtonText: 'Close',
              });
              return;
            } else {
              const newForm = {
                ...form,
                date: new Date(form.check_in || '').toISOString().slice(0, 10),
                check_in: new Date(form.check_in || '').toISOString(),
                check_out: form.check_out
                  ? new Date(form.check_out).toISOString()
                  : null,
                actual_check_in:
                  form.presence === 'Hadir' ? form.actual_check_in : null,
                actual_check_out:
                  form.presence === 'Hadir' ? form.actual_check_out : null,
                presence: form.presence === 'Izin' ? 'Izin' : 'Hadir',
              };

              if (modal) {
                const tempForm = { ...newForm };
                const formAfterDeletion = deleteBaseAttributes(tempForm);

                await updatePresenceBlue({
                  pkid: pkid,
                  data: formAfterDeletion,
                });
                setModal(false);
              }
              setForm(presenceBlueInitialState);
              setEmptyField([]);
              Swal.fire(
                'Saved!',
                'Your presence has been saved.',
                'success',
              ).then(() => {
                refetch();
              });
            }
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modal) {
      setModal(false);
      setForm(presenceBlueInitialState);
    }
  };

  const employeeOptions =
    employeeData?.data.map((employee: { pkid: number; fullname: string }) => ({
      value: employee.pkid,
      label: employee.fullname,
    })) || [];

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        open={modal}
        onClose={() => {
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
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-[30%] max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>Edit Presence Blue</h5>
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
                  <div className='mb-4'>
                    <label className='mb-1 block'>Karyawan</label>
                    <Select
                      value={
                        form.employee_id
                          ? {
                              value: form.employee_id ?? '',
                              label:
                                employeeData?.data.find(
                                  (item: { pkid: number }) =>
                                    item.pkid === form.employee_id,
                                )?.fullname ?? '',
                            }
                          : null
                      }
                      isDisabled={true}
                      placeholder='Pilih karyawan'
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'employee_id')
                      }
                      options={employeeOptions}
                      isLoading={isLoading}
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label className='mb-1 block'>
                      Status <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      value={
                        form.presence
                          ? {
                              value: form.presence ?? '',
                              label: form.presence ?? '',
                            }
                          : null
                      }
                      onChange={selectedOption =>
                        handleSelectChange(selectedOption, 'presence')
                      }
                      options={optionsStatus}
                      isDisabled={form.actual_check_in ? true : false}
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label htmlFor='check_in'>Scheduled Check In</label>
                    <Flatpickr
                      id='check_in'
                      name='check_in'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      disabled={true}
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'check_in')}
                      value={new Date(form.check_in || '')}
                      style={{
                        borderColor: emptyField.includes('check_in')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='check_out'>Scheduled Check Out</label>
                    <Flatpickr
                      id='check_out'
                      name='check_out'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      disabled={true}
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'check_out')}
                      value={form.check_out || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor='actual_check_in'>
                      Actual Check In{' '}
                      {form.presence !== 'Izin' && (
                        <span style={{ color: 'red' }}>*</span>
                      )}
                    </label>
                    <Flatpickr
                      id='actual_check_in'
                      name='actual_check_in'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      disabled={form.presence === 'Izin'}
                      className='form-input'
                      onChange={date =>
                        handleOnChange(date[0], 'actual_check_in')
                      }
                      value={form.actual_check_in || undefined}
                      style={{
                        borderColor: emptyField.includes('actual_check_in')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='actual_check_out'>Actual Check Out</label>
                    <Flatpickr
                      id='actual_check_out'
                      name='actual_check_out'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      disabled={form.presence === 'Izin'}
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date =>
                        handleOnChange(date[0], 'actual_check_out')
                      }
                      value={form.actual_check_out || undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor='event_description'>Event Description</label>
                    <input
                      id='event_description'
                      name='event_description'
                      type='form-textarea'
                      placeholder='Event Description'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(
                          String(e.target.value),
                          'event_description',
                        )
                      }
                      value={form.event_description || ''}
                    />
                  </div>
                </div>
                <div className='mt-8 flex justify-end space-x-2'>
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
                    className='btn btn-primary'
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

export default ModalPresenceBlue;
