'use client';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconLockDots from '@/components/icon/icon-lock-dots';

import { useSubmitForgetPassword } from '@/app/api/hooks/auth/useSubmitForgetPassword';

// Spinner component
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

const ComponentsAuthNewPassword = () => {
  const { mutateAsync: resetPassword } = useSubmitForgetPassword();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = getTranslation();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ new_password: string; confirm_pwd: string }>();

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Jika tidak ada token, redirect ke halaman forgot password
    if (!token) {
      Swal.fire({
        title: t('error'),
        text: t('invalid_reset_token'),
        icon: 'error',
        confirmButtonText: t('ok'),
      }).then(() => {
        router.push('/auth/forgot_password');
      });
    }
  }, [token, router, t]);

  const togglePasswordVisibility = (type: 'new' | 'confirm') => {
    if (type === 'new') {
      setShowPassword(!showPassword);
    } else {
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
      setPasswordError(t('password_requirements_not_met'));
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const onSubmit = async (data: {
    new_password: string;
    confirm_pwd: string;
  }) => {
    const { new_password, confirm_pwd } = data;

    if (new_password !== confirm_pwd) {
      setError('confirm_pwd', { message: t('password_mismatch') });
      return;
    }

    if (!validatePassword(new_password)) {
      return;
    }

    if (!token) {
      Swal.fire(t('error'), t('invalid_reset_token'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        token: token,
        new_password: new_password,
        confirm_pwd: confirm_pwd,
      });

      Swal.fire({
        title: t('success'),
        text: t('password_reset_success'),
        icon: 'success',
        confirmButtonText: t('ok'),
      }).then(() => {
        router.push('/auth/login');
      });
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error?.response?.data) {
        const errorMessage = error.response.data.error || t('unexpected_error');
        Swal.fire(t('error'), errorMessage, 'error');
      } else {
        Swal.fire(t('error'), t('unexpected_error'), 'error');
      }
    }
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label
          htmlFor='new_password'
          className='mb-1 block text-gray-700 dark:text-white'
        >
          {t('new_password')}
        </label>
        <div className='text-white-dark relative'>
          <div className='relative'>
            <input
              id='new_password'
              type={showPassword ? 'text' : 'password'}
              placeholder={t('enter_new_password')}
              className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                errors.new_password || passwordError ? 'border-red-500' : ''
              }`}
              {...register('new_password', {
                required: t('password_required'),
                onChange: e => {
                  validatePassword(e.target.value);
                },
              })}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <span className='absolute start-4 top-1/2 -translate-y-1/2'>
              <IconLockDots fill={true} />
            </span>
            <button
              type='button'
              onClick={() => togglePasswordVisibility('new')}
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
                  <span className='inline-flex items-center'>
                    {passwordValidations.minLength ? <FaCheck /> : <FaTimes />}{' '}
                    &nbsp;{t('min_8_chars')}
                  </span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordValidations.hasUpperCase
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  <span className='inline-flex items-center'>
                    {passwordValidations.hasUpperCase ? (
                      <FaCheck />
                    ) : (
                      <FaTimes />
                    )}{' '}
                    &nbsp;{t('uppercase_letter')}
                  </span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordValidations.hasNumber
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  <span className='inline-flex items-center'>
                    {passwordValidations.hasNumber ? <FaCheck /> : <FaTimes />}{' '}
                    &nbsp;{t('number')}
                  </span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordValidations.hasSpecialChar
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  <span className='inline-flex items-center'>
                    {passwordValidations.hasSpecialChar ? (
                      <FaCheck />
                    ) : (
                      <FaTimes />
                    )}{' '}
                    &nbsp;{t('special_char')}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
        {!isPasswordFocused && passwordError && (
          <p className='mt-1 text-sm text-red-500'>{passwordError}</p>
        )}
        {errors.new_password && (
          <p className='mt-1 text-sm text-red-500'>
            {errors.new_password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='confirm_pwd'
          className='mb-1 block text-gray-700 dark:text-white'
        >
          {t('confirm_password')}
        </label>
        <div className='text-white-dark relative'>
          <div className='relative'>
            <input
              id='confirm_pwd'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('confirm_password_placeholder')}
              className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                errors.confirm_pwd ? 'border-red-500' : ''
              }`}
              {...register('confirm_pwd', {
                required: t('confirm_password_required'),
              })}
            />
            <span className='absolute start-4 top-1/2 -translate-y-1/2'>
              <IconLockDots fill={true} />
            </span>
            <button
              type='button'
              onClick={() => togglePasswordVisibility('confirm')}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400'
            >
              {showConfirmPassword ? (
                <HiEyeOff className='h-5 w-5' />
              ) : (
                <HiEye className='h-5 w-5' />
              )}
            </button>
          </div>
          {errors.confirm_pwd && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.confirm_pwd.message}
            </p>
          )}
        </div>
      </div>

      <button
        type='submit'
        className='btn !mt-6 flex w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(0,120,193,0.44)]'
        disabled={isLoading}
        style={{
          background: 'linear-gradient(to right, #0078C1, #00a1ff)',
          color: 'white',
        }}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className='ml-2'>{t('processing')}</span>
          </>
        ) : (
          t('reset_password')
        )}
      </button>
    </form>
  );
};

export default ComponentsAuthNewPassword;
