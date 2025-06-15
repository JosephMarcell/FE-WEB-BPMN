import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllDepartment } from '@/app/api/hooks/hrm/department/useGetAllDepartment';
import { useCreatePosition } from '@/app/api/hooks/hrm/position/useCreatePosition';
import { useGetPositionByPkid } from '@/app/api/hooks/hrm/position/useGetPositionByPkid';
import { useUpdatePosition } from '@/app/api/hooks/hrm/position/useUpdatePosition';
import { useGetAllWhiteCollarPayrollClass } from '@/app/api/hooks/hrm/white_collar_payroll_class/useGetAllWhiteCollarPayrollClass';
import { positionInitialState } from '@/helpers/utils/hrm/position';
import { WhiteCollarPayrollClassProperty } from '@/helpers/utils/hrm/white_collar_payroll_class';

interface IModalRegisterPositionProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}

interface PositionOption {
  pkid: number | null;
  name: string | null;
}

const collarType: SelectedOption[] = [
  { value: 'White', label: 'White' },
  { value: 'Blue', label: 'Blue' },
];

const ModalPosition = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterPositionProps) => {
  const { data: listDepartment } = useGetAllDepartment();
  const { data: listWhiteCollarPayrollClass } =
    useGetAllWhiteCollarPayrollClass();
  const { mutateAsync: createPosition } = useCreatePosition();
  const { mutateAsync: updatePosition } = useUpdatePosition();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(positionInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: positionDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetPositionByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(positionDetail);
    }
  }, [pkid, modalEdit, positionDetail, isLoading, refetchDetail]);

  const formattedCollarType = collarType.map(option => ({
    ...option,
    value: option.value?.toString() || '', // Convert value to string, use an empty string or a placeholder if value is null/undefined
  }));

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'white_payroll_id',
      'blue_cost_ph',
      'tunjangan_tetap',
      'description',
      'updated_by',
      'updated_date',
      'updated_host',
      'deleted_by',
      'deleted_date',
      'deleted_host',
      'white_is_pemotong_bukpot',
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
      alert(`Required fields: ${requiredField.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleOnChange = (value: string | number, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(positionInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(positionInitialState);
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
            setForm(positionInitialState);
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
            if (modalEdit) {
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updatePosition({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createPosition(form);
              setModal(false);
            }
            setForm(positionInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your position has been saved.',
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
      setForm(positionInitialState);
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
                  {modalEdit ? 'Edit' : 'New'} Position
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
                      Position Name<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Insert Position Name'
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
                    <label htmlFor='collar_type'>
                      Collar Type<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='collar_type'
                      name='collar_type'
                      placeholder='Insert Collar Type'
                      className='basic-single'
                      options={formattedCollarType}
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
                          borderColor: emptyField.includes('type') ? 'red' : '',
                          backgroundColor: modalEdit ? '#e9ecef' : '',
                          cursor: modalEdit ? 'not-allowed' : '',
                        }),
                      }}
                      isDisabled={modalEdit}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value as string, 'type')
                      }
                      value={
                        form.type
                          ? {
                              value: form.type ?? '',
                              label: form.type ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  {/* Make a dropdown based on DP from Department Table */}
                  <div>
                    <label htmlFor='department'>
                      Department<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='department'
                      name='department'
                      placeholder='Insert Department'
                      className='basic-single'
                      options={listDepartment?.data.map(
                        (item: PositionOption) => ({
                          value: item.pkid?.toString() || '',
                          label: item.name ?? '',
                        }),
                      )}
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
                          borderColor: emptyField.includes('department_id')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) => {
                        handleOnChange(
                          selectedOption?.value || '',
                          'department_id',
                        );
                        handleOnChange(
                          selectedOption?.label || '',
                          'Department.name',
                        );
                        // Add the following lines to update the form values
                        setForm(prevForm => ({
                          ...prevForm,
                          department_id:
                            selectedOption?.value?.toString() || null,
                          Department: {
                            ...prevForm.Department,
                            name: selectedOption?.label || '',
                          },
                        }));
                      }}
                      value={
                        form.department_id && form.Department
                          ? {
                              value: form.department_id ?? '',
                              label: form.Department.name ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='description'>Description</label>
                    <input
                      id='description'
                      name='description'
                      type='text'
                      placeholder='Insert Description'
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
                  {form.type === 'White' && (
                    <>
                      <div>
                        <label htmlFor='white_payroll_id'>
                          White Payroll Golongan
                        </label>
                        <Select
                          id='white_payroll_id'
                          name='white_payroll_id'
                          placeholder='Select White Payroll ID'
                          className='basic-single'
                          options={listWhiteCollarPayrollClass?.data.map(
                            (item: {
                              pkid: number;
                              nama_golongan: string;
                            }) => ({
                              value: item.pkid,
                              label: item.nama_golongan,
                            }),
                          )}
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
                              borderColor: emptyField.includes(
                                'white_payroll_id',
                              )
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value as number,
                              'white_payroll_id',
                            )
                          }
                          value={
                            form.white_payroll_id
                              ? {
                                  value: form.white_payroll_id,
                                  label:
                                    listWhiteCollarPayrollClass?.data.find(
                                      (item: WhiteCollarPayrollClassProperty) =>
                                        item.pkid === form.white_payroll_id,
                                    )?.nama_golongan || '',
                                }
                              : null
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor='tunjangan_tetap'>Tunjangan Tetap</label>
                        <input
                          id='tunjangan_tetap'
                          name='tunjangan_tetap'
                          type='number'
                          placeholder='Insert tunjangan tetap'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(
                              Number(e.target.value),
                              'tunjangan_tetap',
                            )
                          }
                          value={form.tunjangan_tetap || 0}
                        />
                      </div>
                    </>
                  )}
                  {form.type === 'Blue' && (
                    <div>
                      <label htmlFor='blue_cost_ph'>Blue Cost PH</label>
                      <input
                        id='blue_cost_ph'
                        name='blue_cost_ph'
                        type='number'
                        placeholder='Insert blue cost per hour'
                        className='form-input'
                        onChange={e =>
                          handleOnChange(Number(e.target.value), 'blue_cost_ph')
                        }
                        value={form.blue_cost_ph || 0}
                      />
                    </div>
                  )}
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

export default ModalPosition;
