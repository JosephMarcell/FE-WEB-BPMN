'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';

import { useRegister } from '@/app/api/hooks/auth/useRegister';

const Spinner = () => (
  <svg
    className='h-5 w-5 animate-spin text-white'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8v8z'
    ></path>
  </svg>
);

const ComponentsAuthRegisterForm = () => {
  const { t, i18n } = getTranslation();
  const { mutateAsync: Register } = useRegister();
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState({
    nik: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
  });

  // Form validation states
  const [isLoading, setIsLoading] = useState(false);
  const [nikError, setNikError] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: '',
  });

  // Add these after your other state declarations
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Add this useEffect hook after your state declarations
  useEffect(() => {
    requestLocation();
  }, []);

  // Modal handler
  const openModal = (type: 'syarat' | 'ketentuan') => {
    if (type === 'syarat') {
      setModalContent({
        title: t('terms_of_service'),
        content: t('terms_content'),
      });
    } else {
      setModalContent({
        title: t('privacy_policy'),
        content: t('privacy_content'),
      });
    }
    setIsModalOpen(true);
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));

    if (id === 'password') validatePassword(value);
    if (id === 'nik') validateNIK(value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'email') {
      setEmailTouched(true);
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validateNIK = (nik: string) => {
    if (nik.length !== 16) {
      setNikError('NIK must be exactly 16 characters.');
    } else if (!/^\d+$/.test(nik)) {
      setNikError('NIK must contain only numbers.');
    } else {
      setNikError('');
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
      setPasswordError('Password does not meet the requirements.');
    } else {
      setPasswordError('');
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!checkboxChecked) {
      Swal.fire(t('error'), t('agree_terms_required'), 'error');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire(t('error'), t('password_mismatch'), 'error');
      setIsLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;

      // Use actual location if available, otherwise fallback to default Jakarta coordinates
      const latitude = location?.latitude || -6.17511;
      const longitude = location?.longitude || 106.865039;

      // console.log('Submitting registration with coordinates:', { latitude, longitude });

      const response = await Register({
        user_name: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: fullName,
        alamat: formData.address,
        latitude,
        longitude,
      });

      // Rest of your submission code...
      Cookies.set('userId', response.data.id);
      Cookies.set('userEmail', formData.email);
      localStorage.setItem('registrationEmail', formData.email);

      Swal.fire({
        title: t('success'),
        html: `${t('registration_success')}<br/><br/>${t(
          'please_check_email',
        )}`,
        icon: 'success',
        confirmButtonText: t('ok'),
      });
      router.push('/auth/verify-account');
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        Swal.fire(
          t('error'),
          error.response?.data?.error || t('registration_failed'),
          'error',
        );
      } else {
        Swal.fire(t('error'), t('unexpected_error'), 'error');
      }
    }
  };

  // Add this function to your component
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung oleh browser ini');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Successfully obtained location:', { latitude, longitude });
        setLocation({ latitude, longitude });
        setIsGettingLocation(false);
      },
      error => {
        console.error('Geolocation error:', error);
        setLocationError(getLocationErrorMessage(error.code));
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Helper to display user-friendly error messages
  const getLocationErrorMessage = (errorCode: number): string => {
    switch (errorCode) {
      case 1:
        return 'Izin lokasi ditolak';
      case 2:
        return 'Lokasi tidak tersedia';
      case 3:
        return 'Waktu permintaan lokasi habis';
      default:
        return 'Terjadi kesalahan dalam mendapatkan lokasi';
    }
  };

  return (
    <>
      <form
        className='mx-auto max-w-4xl space-y-4 rounded-xl bg-[#e6f7ff] p-6 shadow-lg transition-colors dark:bg-[#1b263b] dark:text-white'
        onSubmit={submitForm}
      >
        {/* Username and NIK in one row */}
        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label
              htmlFor='username'
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('username')}
            </label>
            <div className='relative'>
              <input
                id='username'
                type='text'
                placeholder={t('enter_username')}
                className='form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400'
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconUser fill={true} />
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor='email'
            className='mb-1 block text-gray-700 dark:text-[#ffffff]'
          >
            {t('email')}
          </label>
          <div className='relative'>
            <input
              id='email'
              type='email'
              placeholder={t('enter_email')}
              className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                emailError && emailTouched ? 'border-red-500' : ''
              }`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <span className='absolute start-4 top-1/2 -translate-y-1/2'>
              <IconMail fill={true} />
            </span>
          </div>
          {emailError && (
            <p className='mt-1 text-sm text-red-500'>{emailError}</p>
          )}
        </div>

        {/* Address Field */}
        <div className='w-full'>
          <label
            htmlFor='address'
            className='mb-1 block text-gray-700 dark:text-[#ffffff]'
          >
            {t('address')}
          </label>
          <div className='relative'>
            <input
              id='address'
              type='text'
              placeholder={t('enter_address')}
              className='form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400'
              value={formData.address || ''}
              onChange={handleChange}
              required
            />
            <span className='absolute start-4 top-1/2 -translate-y-1/2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-geo-alt'
                viewBox='0 0 16 16'
              >
                <path d='M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31 31 0 0 1 8 14.58a31 31 0 0 1-2.207-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10' />
                <path d='M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4' />
              </svg>
            </span>
          </div>
        </div>

        {/* First and Last Name */}
        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label
              htmlFor='firstName'
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('first_name')}
            </label>
            <div className='relative'>
              <input
                id='firstName'
                type='text'
                placeholder={t('enter_first_name')}
                className='form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400'
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconUser fill={true} />
              </span>
            </div>
          </div>
          <div className='w-1/2'>
            <label
              htmlFor='lastName'
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('last_name')}
            </label>
            <div className='relative'>
              <input
                id='lastName'
                type='text'
                placeholder={t('enter_last_name')}
                className='form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400'
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconUser fill={true} />
              </span>
            </div>
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className='flex gap-4'>
          {/* Password */}
          <div className='relative w-1/2'>
            <label
              htmlFor='password'
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('password')}
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enter_password')}
                className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                  passwordError ? 'border-red-500' : ''
                }`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                required
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconLockDots fill={true} />
              </span>
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400'
              >
                {showPassword ? (
                  <HiEyeOff className='h-5 w-5' />
                ) : (
                  <HiEye className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Password requirements */}
            {isPasswordFocused && (
              <div className='absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white p-2 text-sm shadow-lg dark:border-gray-700 dark:bg-[#0d1b2a]'>
                <p className='font-medium text-[#0078C1] dark:text-[#00a1ff]'>
                  {t('password_requirements')}:
                </p>
                <ul className='mt-1 space-y-1'>
                  <li
                    className={`flex items-center ${
                      passwordValidations.minLength
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {passwordValidations.minLength ? (
                      <FaCheck className='mr-1' />
                    ) : (
                      <FaTimes className='mr-1' />
                    )}
                    {t('min_8_chars')}
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidations.hasUpperCase
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {passwordValidations.hasUpperCase ? (
                      <FaCheck className='mr-1' />
                    ) : (
                      <FaTimes className='mr-1' />
                    )}
                    {t('uppercase_letter')}
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidations.hasNumber
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {passwordValidations.hasNumber ? (
                      <FaCheck className='mr-1' />
                    ) : (
                      <FaTimes className='mr-1' />
                    )}
                    {t('number')}
                  </li>
                  <li
                    className={`flex items-center ${
                      passwordValidations.hasSpecialChar
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {passwordValidations.hasSpecialChar ? (
                      <FaCheck className='mr-1' />
                    ) : (
                      <FaTimes className='mr-1' />
                    )}
                    {t('special_char')}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className='w-1/2'>
            <label
              htmlFor='confirmPassword'
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('confirm_password')}
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('confirm_password_placeholder')}
                className='form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconLockDots fill={true} />
              </span>
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400'
              >
                {showConfirmPassword ? (
                  <HiEyeOff className='h-5 w-5' />
                ) : (
                  <HiEye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Location Status Indicator */}
        <div className='mt-2 text-sm'>
          {isGettingLocation ? (
            <div className='flex items-center text-blue-500'>
              <svg
                className='mr-2 inline-block h-4 w-4 animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Sedang mendapatkan lokasi...
            </div>
          ) : location ? (
            <div className='flex items-center text-green-500'>
              <svg
                className='mr-1 inline-block h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
              Lokasi berhasil dideteksi ({location.latitude.toFixed(6)},{' '}
              {location.longitude.toFixed(6)})
            </div>
          ) : locationError ? (
            <div className='flex items-center'>
              <span className='mr-2 text-red-500'>⚠️ {locationError}</span>
              <button
                type='button'
                onClick={requestLocation}
                className='text-blue-500 hover:underline'
              >
                Coba lagi
              </button>
            </div>
          ) : null}
        </div>

        {/* Checkbox */}
        <div className='mt-6'>
          <label className='flex cursor-pointer items-center'>
            <input
              type='checkbox'
              className='form-checkbox rounded border-gray-300 text-[#0078C1] focus:ring-[#0078C1] dark:border-gray-600'
              onChange={handleCheckboxChange}
              checked={checkboxChecked}
              required
            />
            <span className='ml-2 text-gray-700 dark:text-[#00a1ff] dark:text-gray-400'>
              {t('i_agree_with')}{' '}
              <button
                type='button'
                className='font-bold text-[#00a1ff] hover:underline'
                onClick={() => openModal('syarat')}
              >
                {t('terms')}
              </button>{' '}
              {t('and')}{' '}
              <button
                type='button'
                className='font-bold text-[#00a1ff] hover:underline'
                onClick={() => openModal('ketentuan')}
              >
                {t('privacy')}
              </button>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='btn !mt-6 flex w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(0,120,193,0.44)]'
          disabled={isLoading || !checkboxChecked || nikError !== ''}
          style={{
            background: 'linear-gradient(to right, #0078C1, #00a1ff)',
            color: 'white',
          }}
        >
          {isLoading ? <Spinner /> : t('sign_up')}
        </button>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-[#1b263b]'>
            <div className='p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-xl font-bold text-[#0078C1] dark:text-[#00a1ff]'>
                  {modalContent.title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-300'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <div className='whitespace-pre-line text-gray-700 dark:text-gray-300'>
                {modalContent.content}
              </div>
              <div className='mt-6 flex justify-end'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='rounded bg-[#0078C1] px-4 py-2 text-white transition-colors hover:bg-[#005a8c]'
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComponentsAuthRegisterForm;
