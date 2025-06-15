import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import { Fragment, useEffect, useRef, useState } from 'react';
import { MdCloudUpload, MdSave } from 'react-icons/md';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { getTranslation } from '@/lib/lang/i18n';

import { IRootState } from '@/store';

import { useUpdateAdminTenant } from '@/app/api/hooks/tenant/useUpdateAdminTenant';
import { useUpdateTenantContact } from '@/app/api/hooks/tenant/useUpdateTenantContact';
import { useUpdateTenantLogo } from '@/app/api/hooks/tenant/useUpdateTenantLogo';

const { t } = getTranslation();

interface ModalUpdateTenantProps {
  modal: boolean;
  setModal: (val: boolean) => void;
  tenantData: any;
  onSuccess: () => void;
}

interface UpdateTenantForm {
  name: string;
  description: string;
  logoURL: string;
  contactEmail: string;
  contactPhone: string;
}

const ModalUpdateTenant = ({
  modal,
  setModal,
  tenantData,
  onSuccess,
}: ModalUpdateTenantProps) => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the mutation hooks
  const { mutateAsync: updateTenant } = useUpdateAdminTenant();
  const { mutateAsync: updateContact } = useUpdateTenantContact();
  const { mutateAsync: updateLogo } = useUpdateTenantLogo();

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    contactEmail: Yup.string()
      .email('Invalid email')
      .required('Contact email is required'),
    contactPhone: Yup.string().required('Contact phone is required'),
  });

  // Formik setup
  const formik = useFormik<UpdateTenantForm>({
    initialValues: {
      name: tenantData?.name || '',
      description: tenantData?.description || '',
      logoURL: tenantData?.logo_url || '',
      contactEmail: tenantData?.contact_email || '',
      contactPhone: tenantData?.contact_phone || '',
    },
    validationSchema,
    onSubmit: async values => {
      setIsLoading(true);
      try {
        let hasSuccess = false;
        const updatePromises: Promise<any>[] = [];
        const updateMessages: string[] = [];

        // Check what has changed and only update those parts
        const hasBasicChanges =
          values.name !== tenantData?.name ||
          values.description !== tenantData?.description;

        const hasContactChanges =
          values.contactEmail !== tenantData?.contact_email ||
          values.contactPhone !== tenantData?.contact_phone;

        // 1. Update basic info if changed
        if (hasBasicChanges) {
          const basicUpdatePromise = updateTenant({
            name: values.name,
            description: values.description,
            logoURL: values.logoURL,
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone,
          })
            .then(() => {
              updateMessages.push('Basic tenant information updated');
              hasSuccess = true;
            })
            .catch(error => {
              console.error('Error updating basic tenant info:', error);
              throw error;
            });

          updatePromises.push(basicUpdatePromise);
        }

        // 2. Update contact info if changed - SEPARATE API CALL
        // Note: We're making this call whether or not basic info changes
        if (hasContactChanges) {
          console.log('Updating contact info with:', {
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone,
          });

          const contactUpdatePromise = updateContact({
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone,
          })
            .then(() => {
              updateMessages.push('Contact information updated');
              hasSuccess = true;
            })
            .catch(error => {
              console.error('Error updating contact info:', error);
              throw error;
            });

          updatePromises.push(contactUpdatePromise);
        }

        // 3. Update logo if a new file is selected
        if (logoFile) {
          const logoUpdatePromise = updateLogo(logoFile)
            .then(() => {
              updateMessages.push('Tenant logo updated');
              hasSuccess = true;
            })
            .catch(error => {
              console.error('Error updating logo:', error);
              throw error;
            });

          updatePromises.push(logoUpdatePromise);
        }

        // If nothing changed, still consider it a success
        if (updatePromises.length === 0) {
          updateMessages.push('No changes detected');
          hasSuccess = true;
        }

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        if (hasSuccess) {
          Swal.fire({
            title: 'Success',
            text: updateMessages.join(', '),
            icon: 'success',
          }).then(() => {
            setModal(false);
            onSuccess();
          });
        }
      } catch (error: any) {
        console.error('Error updating tenant:', error);

        // Extract error message
        let errorMessage = 'Failed to update tenant';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle logo file selection
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        Swal.fire({
          title: 'Invalid File',
          text: 'Please upload a valid image file (JPG, JPEG, or PNG)',
          icon: 'error',
        });
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload an image smaller than 2MB',
          icon: 'error',
        });
        return;
      }

      setLogoFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (modal && tenantData) {
      formik.resetForm({
        values: {
          name: tenantData.name || '',
          description: tenantData.description || '',
          logoURL: tenantData.logo_url || '',
          contactEmail: tenantData.contact_email || '',
          contactPhone: tenantData.contact_phone || '',
        },
      });
      setLogoFile(null);
      setPreviewLogo(tenantData.logo_url || null);
    }
  }, [modal, tenantData]);

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
          <div className='fixed inset-0 bg-black/50' />
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
                  Update Tenant
                </Dialog.Title>

                <form onSubmit={formik.handleSubmit} className='mt-4'>
                  <div className='grid grid-cols-1 gap-6'>
                    {/* Tenant Name */}
                    <div>
                      <label
                        htmlFor='name'
                        className='mb-2 block text-sm font-medium'
                      >
                        Tenant Name <span className='text-red-500'>*</span>
                      </label>
                      <input
                        id='name'
                        name='name'
                        type='text'
                        className={`form-input ${
                          formik.touched.name && formik.errors.name
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder='Enter tenant name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className='mt-1 text-sm text-red-500'>
                          {String(formik.errors.name)}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor='description'
                        className='mb-2 block text-sm font-medium'
                      >
                        Description <span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        id='description'
                        name='description'
                        rows={3}
                        className={`form-textarea w-full ${
                          formik.touched.description &&
                          formik.errors.description
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder='Enter tenant description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      ></textarea>
                      {formik.touched.description &&
                        formik.errors.description && (
                          <div className='mt-1 text-sm text-red-500'>
                            {String(formik.errors.description)}
                          </div>
                        )}
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label
                        htmlFor='logo'
                        className='mb-2 block text-sm font-medium'
                      >
                        Tenant Logo
                      </label>

                      {/* Preview & Upload UI */}
                      <div className='mt-1 flex flex-col items-center'>
                        {previewLogo ? (
                          <div className='relative mb-4'>
                            <img
                              src={previewLogo}
                              alt='Tenant Logo'
                              className='h-32 w-32 rounded-lg border object-cover'
                            />
                            <button
                              type='button'
                              onClick={handleRemoveLogo}
                              className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white'
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className='hover:border-primary flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300'
                          >
                            <MdCloudUpload className='h-10 w-10 text-gray-400' />
                            <p className='mt-2 text-sm text-gray-500'>
                              Click to upload logo
                            </p>
                            <p className='text-xs text-gray-400'>
                              JPG, JPEG, PNG (max 2MB)
                            </p>
                          </div>
                        )}

                        <input
                          id='logo'
                          name='logo'
                          type='file'
                          ref={fileInputRef}
                          className='hidden'
                          accept='image/jpeg,image/jpg,image/png'
                          onChange={handleLogoChange}
                        />

                        {!previewLogo && (
                          <button
                            type='button'
                            onClick={() => fileInputRef.current?.click()}
                            className='text-primary mt-2 text-sm hover:underline'
                          >
                            Select a file
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label
                        htmlFor='contactEmail'
                        className='mb-2 block text-sm font-medium'
                      >
                        Contact Email <span className='text-red-500'>*</span>
                      </label>
                      <input
                        id='contactEmail'
                        name='contactEmail'
                        type='email'
                        className={`form-input ${
                          formik.touched.contactEmail &&
                          formik.errors.contactEmail
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder='contact@example.com'
                        value={formik.values.contactEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contactEmail &&
                        formik.errors.contactEmail && (
                          <div className='mt-1 text-sm text-red-500'>
                            {String(formik.errors.contactEmail)}
                          </div>
                        )}
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label
                        htmlFor='contactPhone'
                        className='mb-2 block text-sm font-medium'
                      >
                        Contact Phone <span className='text-red-500'>*</span>
                      </label>
                      <input
                        id='contactPhone'
                        name='contactPhone'
                        type='text'
                        className={`form-input ${
                          formik.touched.contactPhone &&
                          formik.errors.contactPhone
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder='+62123456789'
                        value={formik.values.contactPhone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contactPhone &&
                        formik.errors.contactPhone && (
                          <div className='mt-1 text-sm text-red-500'>
                            {String(formik.errors.contactPhone)}
                          </div>
                        )}
                    </div>

                    {/* Note about readonly fields */}
                    <div className='text-sm italic text-gray-500'>
                      <p>
                        Other tenant details like subscription plan and max
                        users can only be changed by superadmin.
                      </p>
                    </div>
                  </div>

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
                      type='submit'
                      className='btn btn-primary flex items-center gap-2'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <MdSave />
                          Update Tenant
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalUpdateTenant;
