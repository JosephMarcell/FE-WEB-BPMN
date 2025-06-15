import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FiMail, FiUserPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import { IRootState } from '@/store';

import { useInviteUserByEmail } from '@/app/api/hooks/tenant/useInviteUserByEmail';

const { t } = getTranslation();

interface ModalInviteUserByEmailProps {
  modal: boolean;
  setModal: (val: boolean) => void;
  refetch: () => void;
}

const ModalInviteUserByEmail = ({
  modal,
  setModal,
  refetch,
}: ModalInviteUserByEmailProps) => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Invite user mutation
  const { mutateAsync: inviteUserByEmail } = useInviteUserByEmail();

  // Reset form when modal is closed
  useEffect(() => {
    if (!modal) {
      setEmail('');
      setEmailError('');
    }
  }, [modal]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleInviteUser = async () => {
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await inviteUserByEmail({ email });

      Swal.fire({
        title: 'Success',
        text: `Invitation has been sent to ${email}`,
        icon: 'success',
      }).then(() => {
        setModal(false);
        refetch();
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);

      // Extract error message
      let errorMessage = 'Failed to send invitation';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setModal(false)}
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
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='dark:bg-navy-700 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-semibold leading-6 text-gray-900 dark:text-white'
                >
                  Invite User to Tenant
                </Dialog.Title>

                <div className='mt-4'>
                  {/* Email input */}
                  <div className='mb-4'>
                    <label
                      htmlFor='invite-email'
                      className='mb-2 block text-sm font-medium'
                    >
                      User Email <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        id='invite-email'
                        type='email'
                        className={`form-input w-full pl-10 ${
                          emailError ? 'border-red-500' : ''
                        }`}
                        placeholder='Enter user email address'
                        value={email}
                        onChange={e => handleEmailChange(e.target.value)}
                      />
                      <FiMail className='absolute left-3 top-3 text-gray-400' />
                    </div>
                    {emailError && (
                      <div className='mt-1 text-sm text-red-500'>
                        {emailError}
                      </div>
                    )}
                  </div>

                  {/* Info message */}
                  <div className='mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20'>
                    <div className='flex items-start gap-2'>
                      <FiMail className='mt-0.5 text-blue-500' size={16} />
                      <div>
                        <p className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                          Email Invitation
                        </p>
                        <p className='mt-1 text-xs text-blue-600 dark:text-blue-400'>
                          An invitation email will be sent to the specified
                          email address. The user can accept the invitation to
                          join your tenant.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className='mt-6 flex justify-end gap-3'>
                    <button
                      type='button'
                      className='btn btn-outline-danger'
                      onClick={() => setModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary flex items-center gap-2'
                      onClick={handleInviteUser}
                      disabled={!email || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiUserPlus />
                          Send Invitation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalInviteUserByEmail;
