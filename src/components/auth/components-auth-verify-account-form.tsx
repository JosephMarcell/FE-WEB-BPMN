'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import { useVerifyOtp } from '@/app/api/hooks/auth/useVerifyOTP';
import AxiosService from '@/services/axiosService'; // Tambahkan import ini

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

const ComponentsAuthOTPForm = () => {
  const { t } = getTranslation();
  const { mutateAsync: VerifyOTP } = useVerifyOtp();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6 digit OTP
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Ambil email dari cookie yang disimpan saat register
    const userEmail = Cookies.get('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }

    // Jika tidak ada email di cookie, cek di localStorage
    const emailFromStorage = localStorage.getItem('registrationEmail');
    if (!userEmail && emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;

    // Filter hanya karakter alfanumerik (sesuai dengan OTP backend)
    const filteredValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    // Update array OTP
    const updatedOtp = [...otp];
    updatedOtp[index] = filteredValue;
    setOtp(updatedOtp);

    // Auto-focus ke input berikutnya jika nilai diisi
    if (filteredValue.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (filteredValue.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      Swal.fire(t('error'), t('email_not_found_for_verification'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      const otpCode = otp.join('');

      // Pastikan OTP lengkap
      if (otpCode.length !== 6) {
        throw new Error('Please enter complete OTP code');
      }

      const response = await VerifyOTP({
        email: email,
        otp: otpCode,
      });

      Swal.fire({
        title: t('success'),
        text: t('email_verified_success'),
        icon: 'success',
        confirmButtonText: t('proceed_to_login'),
      }).then(() => {
        router.push('/auth/login');
      });
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error) && error?.response?.data) {
        const errorMessage = error.response.data.error;

        if (errorMessage.includes('OTP tidak sesuai')) {
          Swal.fire(t('error'), t('invalid_otp'), 'error');
        } else if (errorMessage.includes('kadaluarsa')) {
          Swal.fire(t('error'), t('otp_expired'), 'error');
        } else if (errorMessage.includes('terlalu banyak percobaan')) {
          Swal.fire(t('error'), t('too_many_attempts'), 'error');
        } else {
          Swal.fire(
            t('error'),
            errorMessage || t('verification_failed'),
            'error',
          );
        }
      } else {
        Swal.fire(t('error'), t('unexpected_error'), 'error');
      }
    }
  };

  const handleResendClick = async () => {
    if (!email) {
      Swal.fire(t('error'), t('email_not_found_for_verification'), 'error');
      return;
    }

    setResendTimer(60);

    try {
      // Gunakan endpoint backend yang benar untuk resend
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/resend-verification-email',
        { email },
      );

      Swal.fire(t('success'), t('otp_resent'), 'success');
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response?.data) {
        Swal.fire(
          t('error'),
          error.response.data.error || t('resend_failed'),
          'error',
        );
      } else {
        Swal.fire(t('error'), t('resend_failed'), 'error');
      }
    }
  };

  // Form untuk input email jika tidak ada email yang tersimpan
  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = (
      document.getElementById('email-input') as HTMLInputElement
    ).value;
    if (emailInput) {
      setEmail(emailInput);
      localStorage.setItem('registrationEmail', emailInput);
    }
  };

  // Render form input email jika tidak ada email tersimpan
  if (!email) {
    return (
      <form className='w-full space-y-4' onSubmit={handleEmailSubmit}>
        <p className='mb-4 text-center text-gray-600 dark:text-gray-300'>
          {t('please_enter_your_email')}
        </p>
        <div>
          <label htmlFor='email-input' className='mb-2 block'>
            {t('email')}
          </label>
          <input
            id='email-input'
            type='email'
            className='w-full rounded border p-2 focus:border-[#00A1FF] focus:outline-none'
            placeholder={t('email_placeholder')}
            required
          />
        </div>
        <button
          type='submit'
          className='btn !mt-6 flex w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(0,120,193,0.44)]'
          style={{
            background: 'linear-gradient(to right, #0078C1, #00a1ff)',
            color: 'white',
          }}
        >
          {t('continue')}
        </button>
      </form>
    );
  }

  return (
    <form className='w-full space-y-4' onSubmit={handleSubmit}>
      <div className='mb-4 text-center'>
        <p className='text-gray-600 dark:text-gray-300'>
          {t('verification_email_sent_to')} <strong>{email}</strong>
        </p>
      </div>

      <div className='flex justify-center gap-2'>
        {[0, 1, 2, 3, 4, 5].map(index => (
          <input
            key={index}
            type='text'
            maxLength={1}
            className='h-14 w-14 rounded-md border-2 border-gray-300 text-center text-2xl focus:border-[#00A1FF]'
            value={otp[index]}
            onChange={e => handleInputChange(e, index)}
            ref={el => {
              inputRefs.current[index] = el;
            }}
          />
        ))}
      </div>

      <div className='text-center'>
        <button
          type='button'
          className='text-[#0078C1] transition-colors hover:text-[#00a1ff]'
          onClick={handleResendClick}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0
            ? `${t('wait')} ${resendTimer} ${t('seconds')}`
            : t('resend_code')}
        </button>
      </div>

      <button
        type='submit'
        className='btn !mt-6 flex w-full items-center justify-center border-0 uppercase shadow-[0_10px_20px_-10px_rgba(0,120,193,0.44)]'
        disabled={isLoading || otp.join('').length !== 6}
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
          t('verify_email')
        )}
      </button>
    </form>
  );
};

export default ComponentsAuthOTPForm;
