'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';

import { setAuthCookies } from '@/lib/auth';
import { getTranslation } from '@/lib/lang/i18n';

import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';

import { useCheckIP } from '@/app/api/hooks/auth/useCheckIP';
import { useLogIn } from '@/app/api/hooks/auth/useLogIn';

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

const ComponentsAuthLoginForm = () => {
  const { t } = getTranslation();
  const { mutateAsync: Login } = useLogIn();
  const router = useRouter();
  const { data: ip } = useCheckIP();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (Cookies.get('authToken')) {
      window.location.href = '/';
    }
  }, [router]);

  useEffect(() => {
    if (ip) localStorage.setItem('ip', ip);
  }, [ip]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  interface LoginFormData {
    email: string; // Ubah dari email_or_username ke email
    password: string;
  }

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    setIsLoading(true);

    try {
      console.log('Mengirim request login ke:', '/api/auth/login');
      console.log('Data login:', { email, password });

      const response = await Login({
        email: email,
        password: password,
      });

      console.log('Login berhasil, response:', response);

      // Set tanda bahwa user pernah login untuk menampilkan notif session expired jika perlu
      localStorage.setItem('hadAuthSession', 'true');

      // Gunakan setAuthCookies untuk mengatur cookies dengan benar
      setAuthCookies({
        access_token: response.data.access_token,
        username: response.data.username,
        role: response.data.role,
        email: response.data.email,
        id: response.data.id,
      });

      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('login_successful'),
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push('/');
        });
      }, 300);
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || '';

        if (
          errorMessage.includes('not found') ||
          errorMessage.includes('tidak ditemukan')
        ) {
          Swal.fire(t('error'), t('account_not_found'), 'error');
        } else if (
          errorMessage.includes('password') ||
          errorMessage.includes('credentials')
        ) {
          Swal.fire(t('error'), t('invalid_password'), 'error');
        } else {
          Swal.fire(t('error'), t('login_failed'), 'error');
        }
      } else {
        Swal.fire(t('error'), t('unexpected_error'), 'error');
      }
    }
  };
  return (
    <form
      className='mx-auto max-w-4xl space-y-4 rounded-xl bg-[#e6f7ff] p-6 shadow-lg transition-colors dark:bg-[#1b263b] dark:text-white'
      onSubmit={handleSubmit(onSubmit)}
    >
      {ip && (
        <div className='space-y-4'>
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
                placeholder={t('email_placeholder')}
                className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                  errors.email && touchedFields.email ? 'border-red-500' : ''
                }`}
                {...register('email', {
                  required: t('email_required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('email_invalid_format'),
                  },
                })}
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconMail fill />
              </span>
            </div>
            {errors.email && touchedFields.email && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor={t('password')}
              className='mb-1 block text-gray-700 dark:text-[#ffffff]'
            >
              {t('password')}
            </label>
            <div className='relative'>
              <input
                id='Password'
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_placeholder')}
                className={`form-input-auth w-full pe-10 ps-10 focus:border-[#00A1FF] focus:ring-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                  errors.password ? 'border-red-500' : ''
                }`}
                {...register('password', {
                  required: t('password_required'),
                })}
              />
              <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                <IconLockDots fill />
              </span>
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute end-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'
              >
                {showPassword ? (
                  <HiEyeOff className='h-5 w-5' />
                ) : (
                  <HiEye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className='text-end'>
            <Link
              href='/auth/forgot_password'
              className='text-sm text-[#0078C1] transition-colors hover:text-[#00a1ff]'
            >
              {t('forgot_password')}
            </Link>
          </div>

          {/* reCAPTCHA */}
          <div className='mt-4'>
            <ReCAPTCHA
              sitekey='6LeJfikrAAAAACTG4vbYcnCXjsx94Cub_UTY-8Y1'
              onChange={value => setRecaptchaValue(value)}
              theme={darkMode ? 'light' : 'dark'}
              size='normal'
              className='mx-auto'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0078C1] to-[#00a1ff] py-2 font-semibold uppercase text-white transition hover:opacity-90 focus:ring-4 focus:ring-[#0078C1]'
            disabled={isLoading || !recaptchaValue}
          >
            {isLoading ? <Spinner /> : t('login_button')}
          </button>
        </div>
      )}
    </form>
  );
};

export default ComponentsAuthLoginForm;
