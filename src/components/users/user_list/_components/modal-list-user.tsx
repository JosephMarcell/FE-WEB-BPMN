import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateUsers } from '@/app/api/hooks/user_management/user/useCreateUsers';
import { useGetUserDetail } from '@/app/api/hooks/user_management/user/useGetUserDetail';
import { useOfficeByToken } from '@/app/api/hooks/user_management/user/useOfficeByToken';
import { useUpdateUser } from '@/app/api/hooks/user_management/user/useUpdateUser';
import { userListInitialState } from '@/helpers/utils/user_management/user_list';
import AxiosService from '@/services/axiosService';

const { t } = getTranslation();

const RoleOptions = [
  { value: 2, label: 'Supervisor' },
  { value: 3, label: 'Office Admin' },
];

interface IModalBackupProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: number | string;
  label: string;
}

const ModalListUser = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalBackupProps) => {
  const { mutateAsync: createUserType } = useCreateUsers();
  const { mutateAsync: updateUserType } = useUpdateUser();
  const { data: officeData, isLoading: isOfficeLoading } = useOfficeByToken();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [nikError, setNikError] = useState('');
  const [form, setForm] = useState(userListInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<SelectedOption | null>(
    null,
  );

  // State khusus edit user (hanya field yang diperlukan API)
  const [editForm, setEditForm] = useState({
    userName: '',
    email: '',
    full_name: '',
    alamat: '',
    latitude: '',
    longitude: '',
  });

  const mandatoryValidation = () => {
    const temp = { ...form };

    // Daftar field wajib untuk mode tambah dan edit
    const requiredFields = modal
      ? [
          'nik',
          'username',
          'email',
          'password',
          'confirm_pwd',
          'first_name',
          'last_name',
          'gender',
          'role',
        ] // Tambahkan password & confirm_pwd untuk tambah user
      : [
          'nik',
          'username',
          'email',
          'first_name',
          'last_name',
          'gender',
          'role',
        ]; // Hilangkan password & confirm_pwd untuk edit user

    const fieldTranslations: Record<string, string> = {
      nik: '"NIK"',
      username: '"Username"',
      email: '"Email"',
      password: '"Password"',
      confirm_pwd: t('confirm_password'),
      first_name: t('first_name'),
      last_name: t('last_name'),
      gender: t('gender'),
      role: t('role'),
    };

    const emptyFields = requiredFields.filter(
      field =>
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === undefined,
    );

    if (emptyFields.length > 0) {
      setEmptyField(emptyFields);
      const translatedEmptyFields = emptyFields
        .map(field => fieldTranslations[field] || field)
        .join(', ');

      Swal.fire({
        title: t('empty_field'),
        text: t('please_fill') + ` ${translatedEmptyFields}!`,
        icon: 'error',
        confirmButtonText: t('close'),
      });

      return false;
    }
    return true;
  };

  const {
    data: listTypeDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetUserDetail(pkid ? String(pkid) : '');

  // Function to get role options with current role at the top
  const getRoleOptions = (isEditMode: boolean, currentRole?: string) => {
    if (isEditMode && currentRole) {
      // Find the current role option
      const currentRoleOption = RoleOptions.find(
        option => option.label === currentRole,
      );

      if (currentRoleOption) {
        // Create a new array with current role first, then other roles
        return [
          { value: currentRoleOption.value, label: currentRoleOption.label },
          ...RoleOptions.filter(option => option.label !== currentRole),
        ];
      }
    }
    return RoleOptions;
  };

  const resetForm = useCallback(() => {
    const defaultForm = {
      ...userListInitialState,
      office: officeData?.pkid || userListInitialState.office,
    };
    setForm(defaultForm);
    setEmptyField([]);
    setCurrentUserRole(null);
  }, [officeData]);

  useEffect(() => {
    if (officeData && !isOfficeLoading) {
      resetForm();
    }
  }, [officeData, isOfficeLoading, modal, modalEdit, resetForm]);

  // Effect to fetch user details when in edit mode
  useEffect(() => {
    if (modalEdit && pkid && !listTypeDetail && !isLoading) {
      refetchDetail();
    }
  }, [modalEdit, pkid, listTypeDetail, isLoading, refetchDetail]);

  // Effect to populate form with user details when in edit mode
  useEffect(() => {
    if (listTypeDetail && modalEdit) {
      // Find the role option that matches the user's current role
      const currentRoleOption = RoleOptions.find(
        option => option.label === listTypeDetail.role,
      );

      setForm(prevForm => ({
        ...prevForm,
        ...listTypeDetail,
        role: currentRoleOption?.value || null,
      }));

      // Set the current user role for dropdown
      if (currentRoleOption) {
        setCurrentUserRole({
          value: currentRoleOption.value,
          label: currentRoleOption.label,
        });
      }
    }
  }, [listTypeDetail, modalEdit]);

  // Populate editForm saat modalEdit aktif
  useEffect(() => {
    if (listTypeDetail && modalEdit) {
      setEditForm({
        userName: listTypeDetail.username || '',
        email: listTypeDetail.email || '',
        full_name: listTypeDetail.full_name || '',
        alamat: listTypeDetail.alamat || '',
        latitude: listTypeDetail.latitude?.toString() || '',
        longitude: listTypeDetail.longitude?.toString() || '',
      });
    }
  }, [listTypeDetail, modalEdit]);

  const handleOnChange = (value: string | number, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [id]: value,
    }));

    if (id === 'password') {
      validatePassword(value);
    }

    if (id === 'nik') {
      validateNIK(value);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    setPasswordValidations({
      minLength: password.length >= minLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    });

    if (
      password.length < minLength ||
      !hasUpperCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setPasswordError('Kata Sandi Tidak Memenuhi Syarat.');
    } else {
      setPasswordError('');
    }
  };

  const validateNIK = (nik: string) => {
    if (nik.length !== 16) {
      setNikError('NIK harus berisi 16 karakter.');
    } else {
      setNikError('');
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(userListInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      resetForm();
    } else {
      Swal.fire({
        title: t('are_you_sure'),
        text: t('not_saved'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes_continue'),
        cancelButtonText: t('no_cancel'),
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            resetForm();
          } catch (error) {
            Swal.fire('Error!', t('error_occurred'), 'error');
          }
        }
      });
    }
  };

  // Ubah handleSubmit khusus untuk edit user (modalEdit)
  const handleSubmit = async () => {
    if (modalEdit) {
      const requiredFields = [
        'userName',
        'email',
        'full_name',
        'alamat',
        'latitude',
        'longitude',
      ];
      const emptyFields = requiredFields.filter(
        field =>
          !editForm[field as keyof typeof editForm] ||
          editForm[field as keyof typeof editForm] === '',
      );
      if (emptyFields.length > 0) {
        setEmptyField(emptyFields);
        Swal.fire({
          title: t('empty_field'),
          text: t('please_fill') + ` ${emptyFields.join(', ')}`,
          icon: 'error',
          confirmButtonText: t('close'),
        });
        return;
      }

      Swal.fire({
        title: t('are_you_sure'),
        text: t('not_revertable'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes_continue'),
        cancelButtonText: t('no_cancel'),
      }).then(async result => {
        if (result.isConfirmed && listTypeDetail?.id) {
          try {
            await updateUserType({
              id: listTypeDetail.id,
              data: {
                userName: editForm.userName,
                email: editForm.email,
                full_name: editForm.full_name,
                alamat: editForm.alamat,
                latitude: Number(editForm.latitude),
                longitude: Number(editForm.longitude),
              },
            });
            setModalEdit(false);
            resetForm();
            Swal.fire(t('success'), t('user_updated'), 'success').then(() => {
              refetch();
            });
          } catch (error: unknown) {
            Swal.fire('Error!', t('error_occurred'), 'error');
          }
        }
      });
      return;
    }

    // Validasi field wajib khusus edit (hanya username, email, full_name, alamat, latitude, longitude)
    if (modalEdit) {
      const requiredFields = [
        'username',
        'email',
        'full_name',
        'alamat',
        'latitude',
        'longitude',
      ];
      const emptyFields = requiredFields.filter(
        field =>
          !form[field] ||
          form[field] === '' ||
          form[field] === null ||
          form[field] === undefined,
      );
      if (emptyFields.length > 0) {
        setEmptyField(emptyFields);
        Swal.fire({
          title: t('empty_field'),
          text: t('please_fill') + ` ${emptyFields.join(', ')}`,
          icon: 'error',
          confirmButtonText: t('close'),
        });
        return;
      }
    } else {
      // Untuk tambah user, tetap pakai mandatoryValidation lama
      const isMandatoryFilled = mandatoryValidation();
      if (!isMandatoryFilled) return;
    }

    Swal.fire({
      title: t('are_you_sure'),
      text: t('not_revertable'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes_continue'),
      cancelButtonText: t('no_cancel'),
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          if (modalEdit && listTypeDetail?.id) {
            // Siapkan body sesuai API
            const updateBody = {
              userName: form.username,
              email: form.email,
              full_name: form.full_name,
              alamat: form.alamat,
              latitude: form.latitude ? Number(form.latitude) : undefined,
              longitude: form.longitude ? Number(form.longitude) : undefined,
            };
            // Panggil endpoint PUT
            await AxiosService.AxiosServiceUserManagement.put(
              `/api/admin/users/${listTypeDetail.id}`,
              updateBody,
            );
            setModalEdit(false);
            resetForm();
            Swal.fire(t('success'), t('user_updated'), 'success').then(() => {
              refetch();
            });
            return;
          }
          if (modal) {
            const {
              nik,
              username,
              email,
              password,
              confirm_pwd,
              first_name,
              last_name,
              gender,
              role,
            } = form;

            await createUserType({
              nik: nik ?? '',
              username: username ?? '',
              email: email ?? '',
              password: password ?? '',
              confirm_pwd: confirm_pwd ?? '',
              first_name: first_name ?? '',
              last_name: last_name ?? '',
              gender: gender ?? '',
              role: role ?? null,
              office: officeData?.pkid || null,
            });

            setModal(false);
            resetForm();
            Swal.fire(t('success'), t('user_added'), 'success').then(() => {
              refetch();
            });
          }
        } catch (error: unknown) {
          const errorMessage =
            error &&
            typeof error === 'object' &&
            'response' in error &&
            error.response &&
            typeof error.response === 'object' &&
            'data' in error.response &&
            error.response.data &&
            typeof error.response.data === 'object' &&
            'error' in error.response.data
              ? (error.response.data.error as string)
                  .split(' ')
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1),
                  )
                  .join(' ')
              : t('error_occurred');
          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      resetForm();
    }
    if (modal) {
      setModal(false);
    }
  };

  const handleEditChange = (value: string, key: string) => {
    setEditForm(prev => ({
      ...prev,
      [key]: value,
    }));
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
                  {modal ? t('add') : t('new')}
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
                  {/* FORM EDIT USER */}
                  {modalEdit && (
                    <div className='space-y-5'>
                      <div>
                        <label htmlFor='userName'>
                          Username<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='userName'
                          name='userName'
                          type='text'
                          className='form-input'
                          value={editForm.userName}
                          onChange={e =>
                            handleEditChange(e.target.value, 'userName')
                          }
                          style={{
                            borderColor: emptyField.includes('userName')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='email'>
                          Email<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='email'
                          name='email'
                          type='email'
                          className='form-input'
                          value={editForm.email}
                          onChange={e =>
                            handleEditChange(e.target.value, 'email')
                          }
                          style={{
                            borderColor: emptyField.includes('email')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='full_name'>
                          Full Name<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='full_name'
                          name='full_name'
                          type='text'
                          className='form-input'
                          value={editForm.full_name}
                          onChange={e =>
                            handleEditChange(e.target.value, 'full_name')
                          }
                          style={{
                            borderColor: emptyField.includes('full_name')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='alamat'>
                          Alamat<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='alamat'
                          name='alamat'
                          type='text'
                          className='form-input'
                          value={editForm.alamat}
                          onChange={e =>
                            handleEditChange(e.target.value, 'alamat')
                          }
                          style={{
                            borderColor: emptyField.includes('alamat')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='latitude'>
                          Latitude<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='latitude'
                          name='latitude'
                          type='number'
                          className='form-input'
                          value={editForm.latitude}
                          onChange={e =>
                            handleEditChange(e.target.value, 'latitude')
                          }
                          style={{
                            borderColor: emptyField.includes('latitude')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor='longitude'>
                          Longitude<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='longitude'
                          name='longitude'
                          type='number'
                          className='form-input'
                          value={editForm.longitude}
                          onChange={e =>
                            handleEditChange(e.target.value, 'longitude')
                          }
                          style={{
                            borderColor: emptyField.includes('longitude')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* FORM TAMBAH USER (modal) tetap seperti sebelumnya */}
                  {modal && (
                    <>
                      <div className='flex gap-2'>
                        <>
                          <div className='w-full'>
                            <label htmlFor='nik'>
                              {t('nik')}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div>
                              <input
                                id='nik'
                                name='nik'
                                type='nik'
                                placeholder={t('enter_nik')}
                                className='form-input'
                                value={form.nik || ''}
                                onChange={handleChange}
                                disabled={!modal}
                                style={{
                                  borderColor: emptyField.includes('nik')
                                    ? 'red'
                                    : '',
                                  backgroundColor: modal ? '' : '#f0f0f0',
                                }}
                              />
                              {nikError && (
                                <p className='mt-2 text-sm text-red-500'>
                                  {nikError}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                        <div className='w-full'>
                          <label htmlFor='username'>
                            {t('username')}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            id='username'
                            name='username'
                            type='username'
                            placeholder={t('enter_username')}
                            className='form-input'
                            value={form.username || ''}
                            onChange={e =>
                              handleOnChange(e.target.value, 'username')
                            }
                            style={{
                              borderColor: emptyField.includes('username')
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor='email'>
                          {t('email')}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          id='email'
                          name='email'
                          type='email'
                          placeholder={t('enter_email')}
                          className='form-input'
                          value={form.email || ''}
                          onChange={e =>
                            handleOnChange(e.target.value, 'email')
                          }
                          disabled={!modal}
                          style={{
                            borderColor: emptyField.includes('email')
                              ? 'red'
                              : '',
                            backgroundColor: modal ? '' : '#f0f0f0',
                          }}
                        />
                      </div>

                      {modal && (
                        <>
                          <div className='relative'>
                            <label htmlFor='password'>
                              {t('password')}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div className='relative'>
                              <input
                                id='password'
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('enter_password')}
                                className='form-input'
                                value={form.password || ''}
                                onChange={handleChange}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                style={{
                                  borderColor: emptyField.includes('password')
                                    ? 'red'
                                    : '',
                                }}
                              />
                              <span
                                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <HiEyeOff className='h-5 w-5' />
                                ) : (
                                  <HiEye className='h-5 w-5' />
                                )}
                              </span>
                            </div>
                            {passwordError && (
                              <p className='mt-2 text-sm text-red-500'>
                                {passwordError}
                              </p>
                            )}
                            {/* Password Validation Tooltip */}
                            {isPasswordFocused && (
                              <div className='absolute bottom-[100%] left-0 w-72 rounded bg-white p-3 text-sm shadow-lg dark:bg-gray-800'>
                                <p>Password harus memiliki:</p>
                                <ul className='mt-2 space-y-1'>
                                  <li
                                    className={
                                      passwordValidations.minLength
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }
                                  >
                                    <span className='inline-flex items-center'>
                                      {passwordValidations.minLength ? (
                                        <FaCheck />
                                      ) : (
                                        <FaTimes />
                                      )}{' '}
                                      &nbsp;Minimal 8 karakter
                                    </span>
                                  </li>
                                  <li
                                    className={
                                      passwordValidations.hasUpperCase
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }
                                  >
                                    <span className='inline-flex items-center'>
                                      {passwordValidations.hasUpperCase ? (
                                        <FaCheck />
                                      ) : (
                                        <FaTimes />
                                      )}{' '}
                                      &nbsp;Huruf kapital
                                    </span>
                                  </li>
                                  <li
                                    className={
                                      passwordValidations.hasNumber
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }
                                  >
                                    <span className='inline-flex items-center'>
                                      {passwordValidations.hasNumber ? (
                                        <FaCheck />
                                      ) : (
                                        <FaTimes />
                                      )}{' '}
                                      &nbsp;Angka
                                    </span>
                                  </li>
                                  <li
                                    className={
                                      passwordValidations.hasSpecialChar
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }
                                  >
                                    <span className='inline-flex items-center'>
                                      {passwordValidations.hasSpecialChar ? (
                                        <FaCheck />
                                      ) : (
                                        <FaTimes />
                                      )}{' '}
                                      &nbsp;Karakter spesial (!@#$%^&*())
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className='relative'>
                            <label htmlFor='confirmPwd'>
                              {t('confirm_password')}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <div className='relative'>
                              <input
                                id='confirmPwd'
                                name='confirmPwd'
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('confirm_password')}
                                className='form-input'
                                value={form.confirm_pwd || ''}
                                onChange={e =>
                                  handleOnChange(e.target.value, 'confirm_pwd')
                                }
                                style={{
                                  borderColor: emptyField.includes(
                                    'confirm_pwd',
                                  )
                                    ? 'red'
                                    : '',
                                }}
                              />
                              <span
                                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <HiEyeOff className='h-5 w-5' />
                                ) : (
                                  <HiEye className='h-5 w-5' />
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className='flex gap-2'>
                        <div className='w-1/2'>
                          <label htmlFor='firstName'>
                            {t('first_name')}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            id='firstName'
                            name='first_name'
                            type='text'
                            placeholder={t('enter_first_name')}
                            className='form-input'
                            value={form.first_name || ''}
                            onChange={e =>
                              handleOnChange(e.target.value, 'first_name')
                            }
                            style={{
                              borderColor: emptyField.includes('first_name')
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                        <div className='w-1/2'>
                          <label htmlFor='lastName'>
                            {t('last_name')}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            id='lastName'
                            name='last_name'
                            type='text'
                            placeholder={t('enter_last_name')}
                            className='form-input'
                            value={form.last_name || ''}
                            onChange={e =>
                              handleOnChange(e.target.value, 'last_name')
                            }
                            style={{
                              borderColor: emptyField.includes('last_name')
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <div className='w-1/2'>
                          <label htmlFor='gender'>
                            {t('gender')}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <Select
                            id='gender'
                            name='gender'
                            placeholder={t('select_gender')}
                            className='basic-single'
                            options={[
                              { value: 'Male', label: 'Male' },
                              { value: 'Female', label: 'Female' },
                            ]}
                            isSearchable={false}
                            isClearable={true}
                            maxMenuHeight={150}
                            menuPlacement='top'
                            styles={{
                              menu: provided => ({ ...provided, zIndex: 9999 }),
                              control: provided => ({
                                ...provided,
                                borderColor: emptyField.includes('gender')
                                  ? 'red'
                                  : '',
                              }),
                            }}
                            onChange={(selectedOption: SelectedOption | null) =>
                              handleOnChange(
                                selectedOption?.value || '',
                                'gender',
                              )
                            }
                            value={
                              form.gender
                                ? { value: form.gender, label: form.gender }
                                : null
                            }
                          />
                        </div>

                        <div className='w-1/2'>
                          <label htmlFor='role'>
                            {t('role')}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <Select
                            id='role'
                            name='role'
                            placeholder={t('select_role')}
                            className='basic-single'
                            options={getRoleOptions(
                              modalEdit,
                              listTypeDetail?.role,
                            )}
                            isSearchable={false}
                            isClearable={true}
                            maxMenuHeight={150}
                            menuPlacement='top'
                            styles={{
                              menu: provided => ({ ...provided, zIndex: 9999 }),
                              control: provided => ({
                                ...provided,
                                borderColor: emptyField.includes('role')
                                  ? 'red'
                                  : '',
                              }),
                            }}
                            onChange={(
                              selectedOption: SelectedOption | null,
                            ) => {
                              handleOnChange(
                                selectedOption?.value || '',
                                'role',
                              );
                              setCurrentUserRole(selectedOption);
                            }}
                            value={currentUserRole}
                          />
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
                    {t('discard')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
                  >
                    {t('save')}
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

export default ModalListUser;
