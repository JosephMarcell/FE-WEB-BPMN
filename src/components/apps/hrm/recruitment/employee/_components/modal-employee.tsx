import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCharity } from '@/app/api/hooks/hrm/charity/useGetAllCharity';
import { useCreateEmployee } from '@/app/api/hooks/hrm/employee/useCreateEmployee';
import { useGetAllEmployee } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useGetEmployeeByPkid } from '@/app/api/hooks/hrm/employee/useGetEmployeeByPkid';
import { useUpdateEmployee } from '@/app/api/hooks/hrm/employee/useUpdateEmployee';
import { useCreateFamilyMember } from '@/app/api/hooks/hrm/family_member/useCreateFamilyMember';
import { useDeleteFamilyMember } from '@/app/api/hooks/hrm/family_member/useDeleteFamilyMember';
import { useUpdateFamilyMember } from '@/app/api/hooks/hrm/family_member/useUpdateFamilyMember';
import { useGetAllInsurance } from '@/app/api/hooks/hrm/insurance/useGetAllInsurance';
import { useGetAllPosition } from '@/app/api/hooks/hrm/position/useGetAllPosition';
import { useGetAllRecruitmentRequest } from '@/app/api/hooks/hrm/recruitment_request/useGetAllRecruitmentRequest';
import { useGetAllSKPT } from '@/app/api/hooks/hrm/tax_variables/skpt/useGetAllSKPT';
import { useGetAllUser } from '@/app/api/hooks/user_management/user/useGetAllUser';
import country from '@/constant/country';
import {
  employeeInitialState,
  EmployeeProperty,
  familyMemberInitialState,
  FamilyMemberProperty,
} from '@/helpers/utils/hrm/employee';
import { RecruitmentRequestProperty } from '@/helpers/utils/hrm/recruitment_request';
import {
  skptInitialState,
  SKPTProperty,
} from '@/helpers/utils/hrm/tax_variables/skpt';

interface IModalEmployeeProps {
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
  req_id: number;
  position_id: number | number;
  Position: {
    name: string;
  };
  status: string;
  already_recruited: number;
  needed_number: number;
}
interface EntityOption {
  pkid: number | null;
  name: string | null;
}

interface UserEntityOption {
  pkid: number | null;
  fullname: string | null;
}

interface SKPTOption {
  pkid: number | null;
  code: string | null;
  description: string | null;
}

const optionsGender = [
  { value: 'Laki-laki', label: 'Laki-laki' },
  { value: 'Perempuan', label: 'Perempuan' },
];

const optionsNewSKPTStatus = [
  { value: 'Tidak ada pengajuan', label: 'Tidak ada pengajuan' },
  { value: 'Diajukan', label: 'Diajukan' },
  { value: 'Ada isu', label: 'Ada isu' },
  { value: 'Terverifikasi', label: 'Terverifikasi' },
];

const optionsVerificationState = [
  { value: 'Belum diajukan', label: 'Belum diajukan' },
  { value: 'Diajukan', label: 'Diajukan' },
  { value: 'Ada isu', label: 'Ada isu' },
  { value: 'Terverifikasi', label: 'Terverifikasi' },
];

const optionsActiveStatus = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Cuti', label: 'Cuti' },
  { value: 'Putus kerja', label: 'Putus kerja' },
];

const optionsFamilyRole = [
  { value: 'Istri', label: 'Istri' },
  { value: 'Suami', label: 'Suami' },
  { value: 'Anak Kandung Laki-laki', label: 'Anak Kandung Laki-laki' },
  { value: 'Anak Kandung Perempuan', label: 'Anak Kandung Perempuan' },
  { value: 'Anak Angkat Laki-laki', label: 'Anak Angkat Laki-laki' },
  { value: 'Anak Angkat Perempuan', label: 'Anak Angkat Perempuan' },
];

const optionsEducation = [
  { value: 'Tidak sekolah', label: 'Tidak sekolah' },
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA/SMK', label: 'SMA/SMK' },
  { value: 'D1/D2', label: 'D1/D2' },
  { value: 'S1', label: 'S1/D3' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' },
];

const ModalEmployee = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalEmployeeProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listRecruitmentRequest } = useGetAllRecruitmentRequest();
  const { mutateAsync: createEmployee } = useCreateEmployee();
  const { data: listUser } = useGetAllUser();
  const { data: listPosition } = useGetAllPosition();
  const { data: listEmployee } = useGetAllEmployee();
  const { mutateAsync: updateEmployee } = useUpdateEmployee();
  const { data: listSKPT } = useGetAllSKPT();
  const { data: listInsurance } = useGetAllInsurance();
  const { data: listCharity } = useGetAllCharity();
  const { mutateAsync: createFamilyMember } = useCreateFamilyMember();
  const { mutateAsync: updatedFamilyMember } = useUpdateFamilyMember();
  const { mutateAsync: deleteFamilyMember } = useDeleteFamilyMember();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(employeeInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [newSKPT, setNewSKPT] = useState(skptInitialState);
  const [newSKPTStatus, setNewSKPTStatus] = useState('');
  const [formDeleteFamily, setFormDeleteFamily] = useState<number[]>([]);

  const {
    data: employeeDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetEmployeeByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(employeeDetail);
    }
  }, [pkid, modalEdit, employeeDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'email',
      'ptkp_id',
      'updated_ptkp_id',
      'updated_ptkp_year',
      'updated_ptkp_issue',
      'amal_id',
      'asuransi_id',
      'alamat',
      'address',
      'phone',
      'signature_url',
      'kartu_keluarga_url',
      'verification_issue',
      'inactive_since',
      'updated_by',
      'updated_date',
      'updated_host',
      'deleted_by',
      'deleted_date',
      'deleted_host',
      'PTKP',
      'Asuransi',
      'Amal',
    ] as string[];
    if (modal) {
      excludeItemField.push('position_id');
      excludeItemField.push('active_status');

      excludeItemField.push('nip');
      excludeItemField.push('npwp');
      excludeItemField.push('nik');
      excludeItemField.push('country_code');
      excludeItemField.push('education');
      excludeItemField.push('updated_ptkp_status');
      excludeItemField.push('verification_state');
      excludeItemField.push('active_status');
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

  const countSKPT = (family_members: FamilyMemberProperty[]) => {
    let is_married = false;
    let is_wife = false;
    let tanggungan = 0;

    family_members.map((item: FamilyMemberProperty) => {
      if (item.role !== null) {
        if (item?.role === 'Istri') {
          is_married = true;
        } else if (item?.role === 'Suami') {
          is_married = true;
          is_wife = true;
        } else if (item?.role.startsWith('Anak')) {
          // if (item.is_working === "Tidak") tanggungan += 1;
          tanggungan += 1;
        }
      }
    });

    let highestTanggungan = skptInitialState;
    let selectedSKPT = skptInitialState;

    listSKPT?.data?.map((item: SKPTProperty) => {
      if (item.is_married === is_married && item.is_wife === is_wife) {
        if (
          highestTanggungan.tanggungan === null ||
          (item.tanggungan !== null &&
            highestTanggungan.tanggungan < item.tanggungan)
        )
          highestTanggungan = item;

        if (item.tanggungan === tanggungan) selectedSKPT = item;
      }
    });

    if (selectedSKPT.tanggungan === null) {
      selectedSKPT = highestTanggungan;
    }

    if (selectedSKPT.pkid !== form.ptkp_id) {
      setNewSKPT(selectedSKPT);
      setNewSKPTStatus('Diajukan');
      setForm({
        ...form,
        ptkp_id: selectedSKPT.pkid,
      });
    }
  };

  const handleOnChange = (
    value: string | number | Date | FamilyMemberProperty[],
    key: string,
  ) => {
    if (key.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    if (value instanceof Array) {
      countSKPT(value);
    }

    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(employeeInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(employeeInitialState);
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
            setForm(employeeInitialState);
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
              const tempForm = { ...form, FamilyMembers: [] };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              const formUpdateFamily = form.FamilyMembers.filter(
                (item: FamilyMemberProperty) => item.pkid !== null,
              );

              const formCreateFamily = form.FamilyMembers.filter(
                (item: FamilyMemberProperty) => item.pkid === null,
              );

              await updateEmployee({
                pkid: pkid,
                data: formAfterDeletion,
              });

              if (formCreateFamily.length > 0) {
                await Promise.all(
                  (formCreateFamily ?? []).map(async item => {
                    if (!item.pkid) {
                      await createFamilyMember({
                        employee_id: pkid,
                        name: item.name,
                        role: item.role,
                      });
                    }
                  }),
                );
              }

              if (formUpdateFamily.length > 0) {
                await Promise.all(
                  (formUpdateFamily ?? []).map(async item => {
                    await updatedFamilyMember({
                      pkid: item.pkid || 0,
                      data: {
                        employee_id: pkid,
                        name: item.name,
                        role: item.role,
                      },
                    });
                  }),
                );
              }

              if (formDeleteFamily.length > 0) {
                await deleteFamilyMember({ data: formDeleteFamily });
              }
              setModalEdit(false);
            }
            if (modal) {
              await createEmployee({
                email: form.email || '',
                fullname: form.fullname || '',
                user_id: form.user_id || 0,
                req_id: form.req_id || 0,
                gender: form.gender || '',
                join_date: form.join_date || '',
                position_id: listRecruitmentRequest?.data.find(
                  (item: RecruitmentRequestProperty) =>
                    item.pkid === form.req_id,
                )?.position_id,
                ptkp_id: listSKPT?.data?.find(
                  (item: SKPTProperty) => item.code === 'TK0',
                )?.pkid,
                updated_ptkp_issue: 'Tidak ada pengajuan',
              });
              setModal(false);
            }
            setForm(employeeInitialState);
            setEmptyField([]);
            Swal.fire(
              'Saved!',
              'Your employee has been saved.',
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
      setForm(employeeInitialState);
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
                  {modalEdit ? 'Edit' : 'New'} Employee
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
                    <label htmlFor='fullname'>
                      Full name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='fullname'
                      name='fullname'
                      type='form-textarea'
                      placeholder='Full name'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'fullname')
                      }
                      value={form.fullname || ''}
                      style={{
                        borderColor: emptyField.includes('title') ? 'red' : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='gender'>
                      Jenis Kelamin<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='gender'
                      name='gender'
                      placeholder='Gender'
                      className='basic-single'
                      options={optionsGender}
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
                          borderColor: emptyField.includes('gender')
                            ? 'red'
                            : '',
                        }),
                      }}
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value || '', 'gender')
                      }
                      value={
                        form.gender
                          ? {
                              value: form.gender ?? '',
                              label: form.gender ?? '',
                            }
                          : null
                      }
                    />
                  </div>
                  {modal && (
                    <div>
                      <label htmlFor='user_id'>
                        User
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='user'
                        name='user'
                        placeholder='Insert User'
                        className='basic-single'
                        options={listUser?.data
                          .filter(
                            (item: UserEntityOption) =>
                              !listEmployee?.data.some(
                                (item_employee: EmployeeProperty) =>
                                  item.pkid === item_employee.user_id,
                              ),
                          )
                          .map((item: UserEntityOption) => ({
                            value: item.pkid,
                            label: item.fullname,
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
                            borderColor: emptyField.includes('position_id')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(
                          selectedOption: {
                            value: number;
                            label: string;
                          } | null,
                        ) => {
                          setForm({
                            ...form,
                            user_id: selectedOption?.value || null,
                          });
                        }}
                        value={
                          form.user_id
                            ? {
                                value: form.user_id ?? '',
                                label:
                                  listUser?.data.find(
                                    (item: { pkid: number }) =>
                                      item.pkid === form.user_id,
                                  )?.fullname ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                  )}
                  {modalEdit && (
                    <div>
                      <label htmlFor='position_id'>
                        Position
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='position'
                        name='position'
                        placeholder='Insert Position'
                        className='basic-single'
                        options={listPosition?.data.map(
                          (item: EntityOption) => ({
                            value: item.pkid,
                            label: item.name,
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
                            borderColor: emptyField.includes('position_id')
                              ? 'red'
                              : '',
                          }),
                        }}
                        onChange={(
                          selectedOption: {
                            value: number;
                            label: string;
                          } | null,
                        ) => {
                          setForm({
                            ...form,
                            position_id: selectedOption?.value || null,
                          });
                        }}
                        value={
                          form.position_id
                            ? {
                                value: form.position_id ?? '',
                                label:
                                  listPosition?.data.find(
                                    (item: { pkid: number }) =>
                                      item.pkid === form.position_id,
                                  )?.name ?? '',
                              }
                            : null
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor='req_id'>
                      Recruitment Request
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='req_id'
                      name='req_id'
                      placeholder='Select Recruitment Request'
                      className='basic-single text-'
                      isDisabled={modalEdit}
                      options={
                        listRecruitmentRequest
                          ? listRecruitmentRequest?.data
                              .reduce(
                                (
                                  acc: OptionSelect[],
                                  current: OptionSelect,
                                ) => {
                                  // Check if the current item's req_id already exists in the accumulator
                                  const exists = acc.some(
                                    item => item.pkid === current.pkid,
                                  );
                                  // If it doesn't exist, add it to the accumulator
                                  if (!exists) {
                                    acc.push(current);
                                  }
                                  return acc;
                                },
                                [],
                              )
                              .filter(
                                (item: OptionSelect) =>
                                  item.status === 'Open' &&
                                  (item.already_recruited ?? 0) <
                                    item.needed_number,
                              ) // Add this line
                              .map((item: OptionSelect) => ({
                                value: item.pkid, // Use pkid as value
                                label: `${item.pkid} - ${item.Position.name}`,
                                position_id: item.position_id, // Include position_id in the option
                                // Change user_id later because BE will return the user_id
                                // user_id:0 , // Include user_id in the option
                              }))
                          : []
                      }
                      onChange={(
                        selectedOption: {
                          value: string;
                          label: string;
                        } | null,
                      ) => {
                        // Update the reqId and positionId state variables
                        setForm({
                          ...form,
                          req_id: Number(selectedOption?.value) || 0,
                        });
                      }}
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
                          borderColor: emptyField.includes('req_id')
                            ? 'red'
                            : '',
                        }),
                      }}
                      value={
                        form.req_id
                          ? {
                              value: form.req_id.toString() ?? '',
                              label:
                                listRecruitmentRequest?.data.find(
                                  (item: OptionSelect) =>
                                    item.pkid === form.req_id,
                                )?.Position.name ?? '',
                            }
                          : undefined // Change null to undefined to match the type 'PropsValue<{ value: string; label: string; position_id: string; }> | undefined'
                      }
                    />
                  </div>
                  {modalEdit && (
                    <>
                      <div>
                        <label htmlFor='nik'>
                          NIK <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='nik'
                          name='nik'
                          type='form-textarea'
                          placeholder='NIK'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'nik')
                          }
                          value={form.nik || ''}
                          style={{
                            borderColor: emptyField.includes('nik')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='nip'>
                          NIP <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='nip'
                          name='nip'
                          type='form-textarea'
                          placeholder='NIP'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'nip')
                          }
                          value={form.nip || ''}
                          style={{
                            borderColor: emptyField.includes('nip')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='npwp'>
                          NPWP <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='npwp'
                          name='npwp'
                          type='form-textarea'
                          placeholder='NPWP'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'npwp')
                          }
                          value={form.npwp || ''}
                          style={{
                            borderColor: emptyField.includes('npwp')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='alamat'>Alamat</label>
                        <input
                          id='alamat'
                          name='alamat'
                          type='form-textarea'
                          placeholder='Alamat'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'alamat')
                          }
                          value={form.alamat || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor='phone'>Nomor Telepon</label>
                        <input
                          id='phone'
                          name='phone'
                          type='form-textarea'
                          placeholder='Phone'
                          className='form-input'
                          onChange={e =>
                            handleOnChange(String(e.target.value), 'phone')
                          }
                          value={form.phone || ''}
                        />
                      </div>
                      <div>
                        <label htmlFor='education'>
                          Pendidikan<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='education'
                          name='education'
                          placeholder='Education'
                          className='basic-single'
                          options={optionsEducation}
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
                              borderColor: emptyField.includes('education')
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || '',
                              'education',
                            )
                          }
                          value={
                            form.education
                              ? {
                                  value: form.education ?? '',
                                  label: form.education ?? '',
                                }
                              : null
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor='country_code'>
                          Asal Negara<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='country_code'
                          name='country_code'
                          placeholder='Country name'
                          className='basic-single'
                          options={country.map(item => ({
                            value: item.code,
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
                              borderColor: emptyField.includes('country_code')
                                ? 'red'
                                : '',
                            }),
                          }}
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || '',
                              'country_code',
                            )
                          }
                          value={
                            form.country_code
                              ? {
                                  value: form.country_code ?? '',
                                  label:
                                    country?.find(
                                      (item: { code: string }) =>
                                        item.code === form.country_code,
                                    )?.name ?? '',
                                }
                              : null
                          }
                        />
                      </div>
                      {/* <div>
                        <label htmlFor='foto_ktp'>Foto KTP</label>
                        <input
                          type='file'
                          // onChange={handleFileChange}
                        />
                      </div>
                      <div>
                        <label htmlFor='foto_ttd'>Foto Tanda Tangan</label>
                        <input
                          type='file'
                          // onChange={handleFileChange}
                        />
                      </div>
                      <div>
                        <label htmlFor='foto_kartu_keluarga'>
                          Foto Kartu Keluarga
                        </label>
                        <input
                          type='file'
                          // onChange={handleFileChange}
                        />
                      </div> */}
                    </>
                  )}
                  <div>
                    <label htmlFor='date'>
                      Join Date <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Flatpickr
                      // value={date1}
                      id='join_date'
                      name='join_date'
                      type='date'
                      placeholder='Pilih Tanggal'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: isRtl ? 'auto right' : 'auto left',
                      }}
                      className='form-input'
                      onChange={date => handleOnChange(date[0], 'join_date')}
                      value={form.join_date || ''}
                      style={{
                        borderColor: emptyField.includes('join_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  {modalEdit && (
                    <>
                      <div>
                        <label className='my-2 text-xl font-bold'>
                          Family Member
                        </label>
                        <div className='space-y-4'>
                          {form.FamilyMembers.map((familyMember, index) => (
                            <div
                              key={index}
                              className='flex-col space-y-2 rounded border p-2'
                            >
                              <div className='flex space-x-3'>
                                <div className='text-lg font-semibold'>
                                  Anggota Keluarga {index + 1}
                                </div>
                                <button
                                  onClick={_ => {
                                    const newFamilyMembers =
                                      form.FamilyMembers.filter(
                                        (_, i) => i !== index,
                                      );
                                    handleOnChange(
                                      newFamilyMembers,
                                      'FamilyMembers',
                                    );

                                    if (familyMember.pkid !== null)
                                      setFormDeleteFamily([
                                        ...formDeleteFamily,
                                        familyMember.pkid,
                                      ]);
                                  }}
                                >
                                  <IconTrashLines />
                                </button>
                              </div>
                              <div>
                                <label htmlFor='fullname'>
                                  Name <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                  id={`fullname-${index}`}
                                  name={`fullname-${index}`}
                                  type='form-textarea'
                                  placeholder='Full name'
                                  className='form-input'
                                  onChange={e => {
                                    const newName = String(e.target.value);
                                    const updatedFamilyMembers =
                                      form.FamilyMembers.map((member, i) =>
                                        i === index
                                          ? { ...member, name: newName }
                                          : member,
                                      );
                                    handleOnChange(
                                      updatedFamilyMembers,
                                      'FamilyMembers',
                                    );
                                  }}
                                  value={familyMember.name || ''}
                                  style={{
                                    borderColor: emptyField.includes('title')
                                      ? 'red'
                                      : '',
                                  }}
                                />
                              </div>
                              <div>
                                <label htmlFor='role'>
                                  Role <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Select
                                  id={`role-${index}`}
                                  name={`role-${index}`}
                                  placeholder='Role'
                                  className='basic-single'
                                  options={optionsFamilyRole}
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
                                      borderColor: emptyField.includes('role')
                                        ? 'red'
                                        : '',
                                    }),
                                  }}
                                  onChange={e => {
                                    familyMember.role = String(e?.value);
                                    const updatedFamilyMembers =
                                      form.FamilyMembers.map((_, i) =>
                                        i === index ? familyMember : _,
                                      );
                                    handleOnChange(
                                      updatedFamilyMembers,
                                      'FamilyMembers',
                                    );
                                  }}
                                  value={
                                    familyMember
                                      ? {
                                          value: familyMember.role ?? '',
                                          label: familyMember.role ?? '',
                                        }
                                      : null
                                  }
                                />
                              </div>
                              {/* <div>
                                <label htmlFor='date'>
                                  Tanggal Lahir{' '}
                                  <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Flatpickr
                                  id={`join_date-${index}`}
                                  name={`join_date-${index}`}
                                  type='date'
                                  placeholder='Pilih Tanggal'
                                  options={{
                                    dateFormat: 'Y-m-d',
                                    position: isRtl
                                      ? 'auto right'
                                      : 'auto left',
                                  }}
                                  className='form-input'
                                  // onChange={date => handleOnChange(date[0], 'join_date')}
                                  value={familyMember.date_of_birth || ''}
                                  style={{
                                    borderColor: emptyField.includes(
                                      'join_date',
                                    )
                                      ? 'red'
                                      : '',
                                  }}
                                />
                              </div> */}
                            </div>
                          ))}
                        </div>
                        <div className='my-4 flex items-center'>
                          <button
                            type='button'
                            className='btn btn-info'
                            onClick={_ =>
                              handleOnChange(
                                [
                                  ...form.FamilyMembers,
                                  familyMemberInitialState,
                                ],
                                'FamilyMembers',
                              )
                            }
                          >
                            Add Family Member
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className='my-2 text-xl font-bold'>
                          Perpajakan, Asuransi & Amal
                        </label>
                        <div>
                          <div className='space-y-4'>
                            <div>
                              <label htmlFor='ptkp_id'>PTKP Sekarang</label>
                              <Select
                                id='ptkp_id'
                                name='ptkp_id'
                                placeholder='Tidak ada PTKP'
                                className='basic-single'
                                options={[
                                  ...(listSKPT?.data?.map(
                                    (item: SKPTOption) => ({
                                      value: item.pkid,
                                      label: `${item.code} - ${item.description}`,
                                    }),
                                  ) || []), // Fallback to an empty array if listSKPT is undefined
                                  {
                                    value: null,
                                    label: 'Tidak ada PTKP',
                                  },
                                ]}
                                isDisabled={true}
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
                                    borderColor: emptyField.includes('ptkp_id')
                                      ? 'red'
                                      : '',
                                  }),
                                }}
                                value={
                                  form.ptkp_id
                                    ? {
                                        value: form.ptkp_id ?? null,
                                        label: listSKPT?.data?.find(
                                          (item: { pkid: number }) =>
                                            item.pkid === form.ptkp_id,
                                        )?.code
                                          ? listSKPT?.data?.find(
                                              (item: { pkid: number }) =>
                                                item.pkid === form.ptkp_id,
                                            )?.code +
                                            ' - ' +
                                            listSKPT?.data?.find(
                                              (item: { pkid: number }) =>
                                                item.pkid === form.ptkp_id,
                                            )?.description
                                          : 'Tidak ada PTKP',
                                      }
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <label htmlFor='updated_ptkp_id'>PTKP Baru</label>
                              <Select
                                id='updated_ptkp_id'
                                name='updated_ptkp_id'
                                placeholder='Tidak ada PTKP baru'
                                className='basic-single'
                                options={[
                                  ...(listSKPT && listSKPT.data
                                    ? listSKPT.data.map((item: SKPTOption) => ({
                                        value: item.pkid,
                                        label: `${item.code} - ${item.description}`,
                                      }))
                                    : []), // Use a fallback empty array if listSKPT or listSKPT.data is undefined
                                  {
                                    value: null,
                                    label: 'Tidak ada PTKP baru',
                                  },
                                ]}
                                isDisabled={true}
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
                                      'updated_ptkp_id',
                                    )
                                      ? 'red'
                                      : '',
                                  }),
                                }}
                                value={
                                  newSKPT.pkid != null
                                    ? {
                                        value: form.updated_ptkp_id ?? null,
                                        label: newSKPT
                                          ? newSKPT.code +
                                            ' - ' +
                                            newSKPT.description
                                          : 'Tidak ada PTKP baru',
                                      }
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <label htmlFor='updated_ptkp_status'>
                                Status PTKP Baru
                              </label>
                              <label className='my-2 text-sm text-gray-400'>
                                Ubah status menjadi &quot;Diajukan&quot; apabila
                                status ialah &quot;Ada isu&quot; dan data sudah
                                dibenarkan
                              </label>
                              <Select
                                id='updated_ptkp_status'
                                name='updated_ptkp_status'
                                placeholder='status'
                                className='basic-single'
                                options={optionsNewSKPTStatus}
                                isDisabled={
                                  form.updated_ptkp_status !== 'Ada isu'
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
                                }}
                                onChange={(
                                  selectedOption: SelectedOption | null,
                                ) => {
                                  // handleOnChange(selectedOption?.value || '', 'updated_ptkp_status')
                                  setNewSKPTStatus(
                                    String(selectedOption?.value) || '',
                                  );
                                }}
                                value={
                                  newSKPTStatus === ''
                                    ? {
                                        value: form.updated_ptkp_status ?? '',
                                        label: form.updated_ptkp_status ?? '',
                                      }
                                    : {
                                        value: newSKPTStatus,
                                        label: newSKPTStatus,
                                      }
                                }
                              />
                            </div>

                            {form.updated_ptkp_status === 'Ada isu' && (
                              <div>
                                <label htmlFor='updated_ptkp_issue'>
                                  Isu Verifikasi PTKP
                                </label>
                                <input
                                  id='updated_ptkp_issue'
                                  name='updated_ptkp_issue'
                                  type='form-textarea'
                                  placeholder='Isu veriifkasi PTKP'
                                  className='form-input'
                                  onChange={e =>
                                    handleOnChange(
                                      String(e.target.value),
                                      'updated_ptkp_issue',
                                    )
                                  }
                                  value={form.updated_ptkp_issue || ''}
                                  style={{
                                    borderColor: emptyField.includes('title')
                                      ? 'red'
                                      : '',
                                  }}
                                />
                              </div>
                            )}

                            <div>
                              <label htmlFor='asuransi_id'>Asuransi</label>
                              <Select
                                id='asuransi_id'
                                name='asuransi_id'
                                placeholder='Pilih asuransi'
                                className='basic-single'
                                options={listInsurance?.data.map(
                                  (item: EntityOption) => ({
                                    value: item.pkid,
                                    label: item.name,
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
                                }}
                                onChange={(
                                  selectedOption: {
                                    value: number;
                                    label: string;
                                  } | null,
                                ) => {
                                  setForm({
                                    ...form,
                                    asuransi_id: selectedOption?.value || null,
                                  });
                                }}
                                value={
                                  form.asuransi_id
                                    ? {
                                        value: form.asuransi_id ?? '',
                                        label:
                                          listInsurance?.data.find(
                                            (item: { pkid: number }) =>
                                              item.pkid === form.asuransi_id,
                                          )?.name ?? '',
                                      }
                                    : null
                                }
                              />
                            </div>

                            <div>
                              <label htmlFor='amal_id'>Amal</label>
                              <Select
                                id='amal_id'
                                name='amal_id'
                                placeholder='Pilih amal'
                                className='basic-single'
                                options={listCharity?.data.map(
                                  (item: EntityOption) => ({
                                    value: item.pkid,
                                    label: item.name,
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
                                }}
                                onChange={(
                                  selectedOption: {
                                    value: number;
                                    label: string;
                                  } | null,
                                ) => {
                                  setForm({
                                    ...form,
                                    amal_id: selectedOption?.value || null,
                                  });
                                }}
                                value={
                                  form.amal_id
                                    ? {
                                        value: form.amal_id ?? '',
                                        label:
                                          listCharity?.data.find(
                                            (item: { pkid: number }) =>
                                              item.pkid === form.amal_id,
                                          )?.name ?? '',
                                      }
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className='mt-4'>
                          <label className='my-2 text-xl font-bold'>
                            Status Kepegawaian
                          </label>
                          <div className='space-y-4'>
                            <div>
                              <label htmlFor='verification_state'>
                                Status Verifikasi
                              </label>
                              <label className='my-2 text-sm text-gray-400'>
                                Ubah status menjadi &quot;Diajukan&quot; apabila
                                status ialah &quot;Ada isu&quot; dan data sudah
                                dibenarkan
                              </label>
                              <Select
                                id='verification_state'
                                name='verification_state'
                                placeholder='Gender'
                                className='basic-single'
                                options={optionsVerificationState}
                                isDisabled={
                                  form.verification_state === 'Terverifikasi'
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
                                }}
                                onChange={(
                                  selectedOption: SelectedOption | null,
                                ) =>
                                  handleOnChange(
                                    selectedOption?.value || '',
                                    'verification_state',
                                  )
                                }
                                value={
                                  form.verification_state
                                    ? {
                                        value: form.verification_state ?? '',
                                        label: form.verification_state ?? '',
                                      }
                                    : null
                                }
                              />
                            </div>

                            {form.verification_state === 'Ada isu' && (
                              <div>
                                <label htmlFor='verification_issue'>
                                  Isu Verifikasi
                                </label>
                                <input
                                  id='verification_issue'
                                  name='verification_issue'
                                  type='form-textarea'
                                  placeholder='Isu veriifkasi'
                                  className='form-input'
                                  onChange={e =>
                                    handleOnChange(
                                      String(e.target.value),
                                      'verification_issue',
                                    )
                                  }
                                  value={form.verification_issue || ''}
                                />
                              </div>
                            )}

                            <div>
                              <label htmlFor='active_status'>
                                Status Keaktifan
                              </label>
                              <Select
                                id='active_status'
                                name='active_status'
                                placeholder='Status'
                                className='basic-single'
                                options={optionsActiveStatus}
                                isSearchable={true}
                                isClearable={true}
                                maxMenuHeight={150}
                                menuPlacement='top'
                                styles={{
                                  menu: provided => ({
                                    ...provided,
                                    zIndex: 9999, // Set a high z-index value
                                  }),
                                }}
                                onChange={(
                                  selectedOption: SelectedOption | null,
                                ) =>
                                  handleOnChange(
                                    selectedOption?.value || '',
                                    'active_status',
                                  )
                                }
                                value={
                                  form.active_status
                                    ? {
                                        value: form.active_status ?? '',
                                        label: form.active_status ?? '',
                                      }
                                    : null
                                }
                              />
                            </div>

                            {form.active_status === 'Putus kerja' && (
                              <div>
                                <label htmlFor='verification_issue'>
                                  Tanggal Putus Kerja
                                </label>
                                <Flatpickr
                                  id='inactive_since'
                                  name='inactive_since'
                                  type='date'
                                  placeholder='Pilih Tanggal'
                                  options={{
                                    dateFormat: 'Y-m-d',
                                    position: isRtl
                                      ? 'auto right'
                                      : 'auto left',
                                  }}
                                  className='form-input'
                                  onChange={date =>
                                    handleOnChange(date[0], 'inactive_since')
                                  }
                                  value={form.inactive_since || ''}
                                  style={{
                                    borderColor: emptyField.includes(
                                      'inactive_since',
                                    )
                                      ? 'red'
                                      : '',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
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

export default ModalEmployee;
