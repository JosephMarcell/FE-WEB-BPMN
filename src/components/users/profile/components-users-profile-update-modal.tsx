import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';

import { getTranslation } from '@/lib/lang/i18n';

import IconX from '@/components/icon/icon-x';

import { UserData } from '@/app/api/hooks/Profile/useGetUserProfile';
import { useUpdateProfile } from '@/app/api/hooks/Profile/useUpdateProfile';

interface UserProfileUpdateModalProps {
  modal: boolean;
  setModal: (isOpen: boolean) => void;
  currentProfileData: UserData;
  onUpdateSuccess: () => void;
}

const ComponentsUserProfileUpdateModal = ({
  modal,
  setModal,
  currentProfileData,
  onUpdateSuccess,
}: UserProfileUpdateModalProps) => {
  const { t } = getTranslation();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [formData, setFormData] = useState({
    username: '',
    full_Name: '',
    alamat: '',
    latitude: '',
    longitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentProfileData) {
      setFormData({
        username: currentProfileData.username || '',
        full_Name: currentProfileData.full_name || '',
        alamat: currentProfileData.alamat || '',
        latitude: currentProfileData.latitude?.toString() || '',
        longitude: currentProfileData.longitude?.toString() || '',
      });
    }
  }, [currentProfileData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        username: formData.username,
        full_Name: formData.full_Name,
        alamat: formData.alamat,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });
      onUpdateSuccess();
      setModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
        onClose={() => setModal(false)}
      >
        <div className='flex min-h-screen items-center justify-center px-4'>
          <Dialog.Panel className='panel dark:text-white-dark my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black'>
            <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
              <h5 className='text-lg font-bold'>{t('update_profile')}</h5>
              <button
                onClick={() => setModal(false)}
                type='button'
                className='text-white-dark hover:text-dark'
              >
                <IconX />
              </button>
            </div>
            <div className='p-5'>
              <form onSubmit={handleSubmit}>
                <div className='mb-5'>
                  <label htmlFor='username'>{t('username')}</label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    className='form-input'
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className='mb-5'>
                  <label htmlFor='full_Name'>{t('full_name')}</label>
                  <input
                    id='full_Name'
                    name='full_Name'
                    type='text'
                    className='form-input'
                    value={formData.full_Name}
                    onChange={handleChange}
                  />
                </div>
                <div className='mb-5'>
                  <label htmlFor='alamat'>{t('address')}</label>
                  <textarea
                    id='alamat'
                    name='alamat'
                    rows={3}
                    className='form-textarea'
                    value={formData.alamat}
                    onChange={handleChange}
                  />
                </div>
                <div className='mb-5'>
                  <label htmlFor='latitude'>Latitude</label>
                  <input
                    id='latitude'
                    name='latitude'
                    type='number'
                    className='form-input'
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>
                <div className='mb-5'>
                  <label htmlFor='longitude'>Longitude</label>
                  <input
                    id='longitude'
                    name='longitude'
                    type='number'
                    className='form-input'
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
                <div className='mt-8 flex items-center justify-end'>
                  <button
                    type='button'
                    className='btn btn-outline-danger'
                    onClick={() => setModal(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('saving') : t('save')}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ComponentsUserProfileUpdateModal;
