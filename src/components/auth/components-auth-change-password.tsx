'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';

import IconLockDots from '@/components/icon/icon-lock-dots';

import { useChangePassword } from '@/app/api/hooks/auth/useChangePassword';

const ComponentsAuthChangePassword = () => {
  const { mutateAsync: changePassword } = useChangePassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{
    old_password: string;
    new_password: string;
    confirm_pwd: string;
  }>();

  const togglePasswordVisibility = (type: 'old' | 'new' | 'confirm') => {
    if (type === 'old') {
      setShowOldPassword(!showOldPassword);
    }
    if (type === 'new') {
      setShowPassword(!showPassword);
    }
    if (type === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
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

  const handleSignOut = async () => {
    Cookies.remove('authToken'); // Hapus token di cookies
    localStorage.removeItem('authToken'); // Hapus token di localStorage
    window.location.href = '/auth/login'; // Redirect ke halaman login
  };

  const onSubmit = async (data: {
    old_password: string;
    new_password: string;
    confirm_pwd: string;
  }) => {
    if (data.new_password === data.old_password) {
      setError('new_password', {
        message: 'Sandi baru tidak boleh sama dengan sandi lama',
      });
      return;
    }

    if (data.new_password !== data.confirm_pwd) {
      setError('confirm_pwd', { message: 'Kata sandi tidak sesuai' });
      return;
    }

    try {
      const response = await changePassword(data);

      if (response.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kata sandi berhasil diubah. Anda akan diarahkan ke halaman login.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          handleSignOut(); // Panggil fungsi sign out
        });
      } else {
        Swal.fire(
          'Error!',
          response.error || 'Gagal mengubah kata sandi',
          'error',
        );
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
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1),
              )

              .join(' ')
          : 'An error occurred';

      Swal.fire('Error!', errorMessage, 'error');
    }
  };

  return (
    <form className='w-full space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='old_password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Kata Sandi Lama
          </label>
          <div className='relative mt-1'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <IconLockDots className='h-5 w-5 text-[#0078C1]' />
            </div>
            <input
              id='old_password'
              type={showOldPassword ? 'text' : 'password'}
              placeholder='Masukkan Kata Sandi Lama'
              className={`block w-full rounded-md border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-[#0078C1] focus:ring-[#0078C1] sm:text-sm ${
                errors.old_password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('old_password', {
                required: 'Kata sandi lama wajib diisi',
              })}
            />
            <button
              type='button'
              onClick={() => togglePasswordVisibility('old')}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400'
            >
              {showOldPassword ? (
                <HiEyeOff className='h-5 w-5' />
              ) : (
                <HiEye className='h-5 w-5' />
              )}
            </button>
          </div>
          {errors.old_password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.old_password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='new_password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Kata Sandi Baru
          </label>
          <div className='relative mt-1'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <IconLockDots className='h-5 w-5 text-[#0078C1]' />
            </div>
            <input
              id='new_password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Masukkan Kata Sandi Baru'
              className={`block w-full rounded-md border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-[#0078C1] focus:ring-[#0078C1] sm:text-sm ${
                errors.new_password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('new_password', {
                required: 'Kata sandi baru wajib diisi',
                onChange: e => validatePassword(e.target.value),
              })}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <button
              type='button'
              onClick={() => togglePasswordVisibility('new')}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400'
            >
              {showPassword ? (
                <HiEyeOff className='h-5 w-5' />
              ) : (
                <HiEye className='h-5 w-5' />
              )}
            </button>
          </div>

          {isPasswordFocused && (
            <div className='absolute z-10 mt-1 w-full rounded border border-gray-200 bg-white p-2 text-sm shadow-lg'>
              <p className='text-gray font-medium'>Password requirements:</p>
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
                  Min 8 characters
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
                  Uppercase letter
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
                  Number
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
                  Special character (!@#$%^&*())
                </li>
              </ul>
            </div>
          )}
          {errors.new_password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.new_password.message}
            </p>
          )}
          {passwordError && (
            <p className='mt-1 text-sm text-red-600'>{passwordError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='confirm_pwd'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Konfirmasi Kata Sandi Baru
          </label>
          <div className='relative mt-1'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
              <IconLockDots className='h-5 w-5 text-[#0078C1]' />
            </div>
            <input
              id='confirm_pwd'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Konfirmasi Kata Sandi Baru'
              className={`block w-full rounded-md border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-[#0078C1] focus:ring-[#0078C1] sm:text-sm ${
                errors.confirm_pwd ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('confirm_pwd', {
                required: 'Konfirmasi kata sandi wajib diisi',
              })}
            />
            <button
              type='button'
              onClick={() => togglePasswordVisibility('confirm')}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400'
            >
              {showConfirmPassword ? (
                <HiEyeOff className='h-5 w-5' />
              ) : (
                <HiEye className='h-5 w-5' />
              )}
            </button>
          </div>
          {errors.confirm_pwd && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.confirm_pwd.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          className='btn !mt-6 flex w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(0,120,193,0.44)]'
          style={{
            background: 'linear-gradient(to right, #0078C1, #00a1ff)',
            color: 'white',
          }}
        >
          Ganti Kata Sandi
        </button>
      </div>
    </form>
  );
};

export default ComponentsAuthChangePassword;
