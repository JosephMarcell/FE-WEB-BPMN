'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconMail from '@/components/icon/icon-mail';

import { useCheckIP } from '@/app/api/hooks/auth/useCheckIP';
import { useSendResetPassword } from '@/app/api/hooks/auth/useSendResetPassword';

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

const ComponentsAuthForgotPassword = () => {
  const router = useRouter();
  const { mutateAsync: SendResetPassword } = useSendResetPassword();
  const { data: ip } = useCheckIP();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = getTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields },
  } = useForm<{ email: string }>({
    mode: 'onTouched',
  });

  useEffect(() => {
    if (Cookies.get('authToken')) {
      window.location.href = '/';
    }
  }, [router]);

  useEffect(() => {
    if (ip) localStorage.setItem('ip', ip);
  }, [ip]);

  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    const ipFromLocalStorage = localStorage.getItem('ip') || '';

    if (ipFromLocalStorage === '') {
      Swal.fire(t('error'), t('ip_fetch_error'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      await SendResetPassword({ email });

      // Tampilkan success dan instruksi berikutnya
      setEmailSent(true);
      Swal.fire({
        title: t('success'),
        text: t('reset_password_success'),
        icon: 'success',
        confirmButtonText: t('ok'),
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error) && error?.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes('not registered')) {
          setError('email', { message: t('email_not_registered') });
        } else {
          Swal.fire(t('error'), t('unexpected_error'), 'error');
        }
      } else {
        Swal.fire(t('error'), t('server_error'), 'error');
      }
    }
  };

  return (
    <form
      className='mx-auto w-full max-w-4xl space-y-4 rounded-xl bg-[#e6f7ff] p-6 shadow-lg transition-colors dark:bg-[#1b263b] dark:text-white'
      onSubmit={handleSubmit(onSubmit)}
    >
      {ip && (
        <div className='space-y-4'>
          {emailSent ? (
            <div className='rounded-lg bg-green-50 p-4 dark:bg-green-900/20'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-green-400'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-green-800 dark:text-green-200'>
                    {t('reset_password_success')}
                  </h3>
                  <div className='mt-2 text-sm text-green-700 dark:text-green-300'>
                    <p>{t('reset_password_instructions')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor='Email'
                  className='mb-1 block text-gray-700 dark:text-[#ffffff]'
                >
                  {t('email')}
                </label>
                <div className='relative'>
                  <input
                    id='Email'
                    type='email'
                    placeholder={t('email_placeholder')}
                    className={`form-input-auth w-full ps-10 focus:border-[#00A1FF] dark:border-gray-600 dark:bg-[#0d1b2a] dark:text-white dark:placeholder-gray-400 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    {...register('email', {
                      required: t('email_required'),
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: t('invalid_email'),
                      },
                    })}
                  />
                  <span className='absolute start-4 top-1/2 -translate-y-1/2'>
                    <IconMail fill={true} />
                  </span>
                </div>
                {touchedFields.email && errors.email && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.email.message}
                  </p>
                )}
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
                  t('confirm_email')
                )}
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default ComponentsAuthForgotPassword;
