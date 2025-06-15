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

import { useGetAllEmployeeWhite } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useCreatePresenceWhite } from '@/app/api/hooks/hrm/presence_white/useCreatePresenceWhite';
import { useGetPresenceWhiteByPkid } from '@/app/api/hooks/hrm/presence_white/useGetPresenceWhiteByPkid';
import { useUpdatePresenceWhite } from '@/app/api/hooks/hrm/presence_white/useUpdatePresenceWhite';
import {
  presenceWhiteInitialState,
  PresenceWhiteProperty,
} from '@/helpers/utils/hrm/presence_white';

interface IModalPresenceWhiteProps {
  modal: boolean;
  modalEdit: boolean;
  pkid: number;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
  refetchCount: () => void;
}

const optionsStatus = [
  { value: 'Hadir', label: 'Hadir' },
  { value: 'Izin', label: 'Izin' },
];

const ModalPresenceWhite = ({
  modal,
  modalEdit,
  pkid,
  setModal,
  setModalEdit,
  refetch,
  refetchCount,
}: IModalPresenceWhiteProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const { data: employeeData } = useGetAllEmployeeWhite();
  const { mutateAsync: createPresenceWhite } = useCreatePresenceWhite();
  const { mutateAsync: updatePresenceWhite } = useUpdatePresenceWhite();
  const {
    data: presenceDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetPresenceWhiteByPkid(pkid);

  const [form, setForm] = useState(presenceWhiteInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const handleSelectChange = (
    value: Option | null,
    field: keyof PresenceWhiteProperty,
  ) => {
    setForm({ ...form, [field]: value?.value });
  };

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(presenceDetail);
    }
  }, [pkid, modalEdit, presenceDetail, isLoading, refetchDetail]);

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
    if (!modalEdit) excludeItemField.push('pkid');
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
    if (JSON.stringify(form) === JSON.stringify(presenceWhiteInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(presenceWhiteInitialState);
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
            setForm(presenceWhiteInitialState);
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
            const newForm = {
              ...form,
              date: new Date(form.check_in || ''),
              check_in: new Date(form.check_in || ''),
              check_out: form.check_out ? new Date(form.check_out) : null,
            };

            if (modalEdit) {
              const tempForm = { ...newForm };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updatePresenceWhite({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createPresenceWhite(newForm);
              setModal(false);
            }
            setForm(presenceWhiteInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your presence has been saved.',
              'success',
            ).then(() => {
              refetch();
              refetchCount();
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
      setForm(presenceWhiteInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  const employeeOptions =
    employeeData?.data.map((employee: { pkid: number; fullname: string }) => ({
      value: employee.pkid,
      label: employee.fullname,
    })) || [];

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
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-[30%] max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  {modalEdit ? 'Edit' : 'New'} Presence White
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
                  <div className='mb-4'>
                    <label className='mb-1 block'>
                      Karyawan <span style={{ color: 'red' }}>*</span>
                    </label>
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
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label htmlFor='check_in'>
                      Check In <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      id='check_in'
                      name='check_in'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'check_in')}
                      value={form.check_in || undefined}
                      style={{
                        borderColor: emptyField.includes('check_in')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='check_out'>Check Out</label>
                    <Flatpickr
                      id='check_out'
                      name='check_out'
                      data-enable-time
                      type='datetime-local'
                      placeholder='Pilih Tanggal'
                      disabled={form.presence !== 'Hadir'}
                      options={{
                        dateFormat: 'Y-m-d H:i',
                        enableTime: true,
                        time_24hr: true,
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'check_out')}
                      value={form.check_out || undefined}
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

export default ModalPresenceWhite;
