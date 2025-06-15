import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllPosition } from '@/app/api/hooks/hrm/position/useGetAllPosition';
import { useCreateRecruitmentRequest } from '@/app/api/hooks/hrm/recruitment_request/useCreateRecruitmentRequest';
import { useGetRecruitmentRequestByPkid } from '@/app/api/hooks/hrm/recruitment_request/useGetRecruitmentRequestByPkid';
import { useUpdateRecruitmentRequest } from '@/app/api/hooks/hrm/recruitment_request/useUpdateRecruitmentRequest';
import { recruitmentRequestInitialState } from '@/helpers/utils/hrm/recruitment_request';

interface IModalRecruitmentRequestProps {
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
interface OptionSelect {
  pkid: string | number;
  name: string;
}
const optionsType = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
];

const ModalRecruitmentRequest = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRecruitmentRequestProps) => {
  const { data: listPosition } = useGetAllPosition();
  const { mutateAsync: createRecruitmentRequest } =
    useCreateRecruitmentRequest();
  const { mutateAsync: updateRecruitmentRequest } =
    useUpdateRecruitmentRequest();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(recruitmentRequestInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const {
    data: recruitmentRequestDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetRecruitmentRequestByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(recruitmentRequestDetail);
    }
  }, [pkid, modalEdit, recruitmentRequestDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'already_recruited',
      'pkid',
      'description',
      'created_by',
      'updated_by',
      'updated_date',
      'updated_host',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ] as string[];
    if (!modalEdit) excludeItemField.push('status');
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === 0 ||
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
    if (
      JSON.stringify(form) === JSON.stringify(recruitmentRequestInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(recruitmentRequestInitialState);
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
            setForm(recruitmentRequestInitialState);
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

              await updateRecruitmentRequest({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              await createRecruitmentRequest({
                ...form,
                status: 'Open',
              });
              setModal(false);
            }
            setForm(recruitmentRequestInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your recruitment request has been saved.',
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
      setForm(recruitmentRequestInitialState);
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
                <h5 className='text-lg font-bold'>New Recruitment Request</h5>
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
                    <label htmlFor='position_id'>
                      Position
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='position_id'
                      name='position_id'
                      placeholder='Select Position'
                      className='basic-single text-'
                      options={
                        listPosition
                          ? listPosition?.data.map((item: OptionSelect) => ({
                              value: item.pkid,
                              label: item.name,
                            }))
                          : []
                      }
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
                          borderColor: emptyField.includes('position_id')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(
                          selectedOption?.value || '',
                          'position_id',
                        )
                      }
                      value={
                        form.position_id
                          ? {
                              value: form.position_id ?? '',
                              label:
                                listPosition?.data.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.position_id,
                                )?.name ?? '',
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
                      type='form-textarea'
                      placeholder='Description'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'description')
                      }
                      value={form.description || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor='needed_number'>
                      Needed Number<span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='needed_number'
                      name='needed_number'
                      type='number'
                      placeholder='Needed Number'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'needed_number')
                      }
                      value={form.needed_number || ''}
                      style={{
                        borderColor: emptyField.includes('title') ? 'red' : '',
                      }}
                    />
                  </div>
                  {modalEdit && (
                    <div>
                      <label htmlFor='status'>
                        Status<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='status'
                        name='status'
                        placeholder='Status'
                        className='basic-single'
                        options={optionsType}
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
                            borderColor: emptyField.includes('status')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(selectedOption?.value || '', 'status')
                        }
                        value={
                          form.status
                            ? {
                                value: form.status ?? '',
                                label: form.status ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                  )}
                  {/* <div>
                    <label htmlFor='Position'>
                      Position <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='Position'
                      name='Position'
                      type='text'
                      placeholder='Position'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'Position')
                      }
                      value={form.Position ? form.Position.name || '':''}
                      style={{
                        borderColor: emptyField.includes('Position') ? 'red' : '',
                      }}
                    />
                  </div> */}
                  {/* <div>
                    <label htmlFor='already_recruited'>
                      Already Recruited <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='already_recruited'
                      name='already_recruited'
                      type='number'
                      placeholder='Already Recruited'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'already_recruited')
                      }
                      value={form.already_recruited || ''}
                      style={{
                        borderColor: emptyField.includes('title') ? 'red' : '',
                      }}
                    />
                  </div> */}
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

export default ModalRecruitmentRequest;
