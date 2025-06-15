import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import 'react-datepicker/dist/react-datepicker.css';

import { getTranslation } from '@/lib/lang/i18n';

import IconLoader from '@/components/icon/icon-loader';

import { IRootState } from '@/store';

import { useUpdateTenant } from '@/app/api/hooks/tenant/useUpdateTenant';
import AxiosService from '@/services/axiosService';

const { t } = getTranslation();

interface IModalTenant {
  modal: boolean;
  setModal: (val: boolean) => void;
  refetch: () => void;
  isEdit?: boolean;
  editData?: Tenant | null;
}

interface Tenant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  subscription_plan: string;
  subscription_start_date: string;
  subscription_end_date: string;
  max_users: number;
  is_active: boolean;
}

interface TenantForm {
  name: string;
  description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  max_users: number;
  subscription_plan: string;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
  is_active: boolean;
}

const initialTenantState: TenantForm = {
  name: '',
  description: '',
  logo_url: '',
  contact_email: '',
  contact_phone: '',
  max_users: 50,
  subscription_plan: 'basic',
  subscription_start_date: new Date(),
  subscription_end_date: new Date(
    new Date().setFullYear(new Date().getFullYear() + 1),
  ),
  is_active: true,
};

const subscriptionPlans = [
  { value: 'basic', label: 'Basic' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
];

const ModalTenant = ({
  modal,
  setModal,
  refetch,
  isEdit = false,
  editData = null,
}: IModalTenant) => {
  const [form, setForm] = useState<TenantForm>(initialTenantState);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const tenantId = useSelector((state: IRootState) => state.themeConfig.pkid);

  const { mutateAsync: updateTenant } = useUpdateTenant(String(tenantId));

  // Reset form when modal is closed or when switching between create/edit modes
  useEffect(() => {
    if (!modal) {
      setForm(initialTenantState);
      setEmptyField([]);
      return;
    }

    // If edit mode and we have tenant data, populate the form
    if (isEdit && editData) {
      setForm({
        name: editData.name || '',
        description: editData.description || '',
        logo_url: editData.logo_url || '',
        contact_email: editData.contact_email || '',
        contact_phone: editData.contact_phone || '',
        max_users: editData.max_users || 50,
        subscription_plan: editData.subscription_plan || 'basic',
        subscription_start_date: editData.subscription_start_date
          ? new Date(editData.subscription_start_date)
          : null,
        subscription_end_date: editData.subscription_end_date
          ? new Date(editData.subscription_end_date)
          : null,
        is_active: editData.is_active || false,
      });
    } else {
      // In create mode, use default initial state
      setForm(initialTenantState);
    }
  }, [modal, isEdit, editData]);

  const handleChange = (
    value: string | number | boolean | Date | null,
    field: keyof TenantForm,
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));

    // Remove field from emptyField if it's filled
    if (value) {
      setEmptyField(prev => prev.filter(item => item !== field));
    }
  };

  const validateForm = () => {
    const requiredFields: (keyof TenantForm)[] = [
      'name',
      'description',
      'contact_email',
      'max_users',
    ];

    if (!isEdit) {
      // Add these fields only for create mode
      requiredFields.push('subscription_plan');
      requiredFields.push('subscription_start_date');
      requiredFields.push('subscription_end_date');
    }

    const newEmptyFields = requiredFields.filter(field => {
      const value = form[field];
      // For number fields like max_users, check if it's 0 or undefined
      if (typeof value === 'number') {
        return value === undefined;
      }
      // For string fields, check if empty/null/undefined
      return value === null || value === undefined || value === '';
    });

    if (newEmptyFields.length > 0) {
      setEmptyField(newEmptyFields as string[]);
      return false;
    }

    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!validateEmail(form.contact_email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setEmptyField(prev => [...prev, 'contact_email']);
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit) {
        // Update existing tenant with all required fields
        await updateTenant({
          name: form.name,
          description: form.description,
          logo_url: form.logo_url,
          contact_email: form.contact_email,
          contact_phone: form.contact_phone,
          max_users: form.max_users,
        });

        Swal.fire({
          title: 'Success!',
          text: 'Tenant has been updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        // Create new tenant
        const formattedData = {
          ...form,
          subscription_start_date: form.subscription_start_date?.toISOString(),
          subscription_end_date: form.subscription_end_date?.toISOString(),
        };

        await AxiosService.AxiosServiceUserManagement.post(
          '/api/tenants',
          formattedData,
        );

        Swal.fire({
          title: 'Success!',
          text: 'Tenant has been created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

      setModal(false);
      refetch();
    } catch (error) {
      console.error('Error with tenant:', error);
      let errorMessage = isEdit
        ? 'Failed to update tenant'
        : 'Failed to create tenant';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
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
              <Dialog.Panel className='dark:bg-navy-800 w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-semibold leading-6 text-gray-900 dark:text-white'
                >
                  {isEdit ? 'Edit Tenant' : 'Add New Tenant'}
                </Dialog.Title>

                <div className='mt-4'>
                  <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                          type='text'
                          className={`form-input w-full ${
                            emptyField.includes('name') ? 'border-red-500' : ''
                          }`}
                          value={form.name}
                          onChange={e => handleChange(e.target.value, 'name')}
                          placeholder='Enter tenant name'
                        />
                      </div>

                      {/* Contact Email */}
                      <div>
                        <label
                          htmlFor='contact_email'
                          className='mb-2 block text-sm font-medium'
                        >
                          Contact Email <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='contact_email'
                          type='email'
                          className={`form-input w-full ${
                            emptyField.includes('contact_email')
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={form.contact_email}
                          onChange={e =>
                            handleChange(e.target.value, 'contact_email')
                          }
                          placeholder='Enter contact email'
                        />
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <label
                          htmlFor='contact_phone'
                          className='mb-2 block text-sm font-medium'
                        >
                          Contact Phone
                        </label>
                        <input
                          id='contact_phone'
                          type='text'
                          className='form-input w-full'
                          value={form.contact_phone}
                          onChange={e =>
                            handleChange(e.target.value, 'contact_phone')
                          }
                          placeholder='Enter contact phone'
                        />
                      </div>

                      {/* Logo URL */}
                      <div>
                        <label
                          htmlFor='logo_url'
                          className='mb-2 block text-sm font-medium'
                        >
                          Logo URL
                        </label>
                        <input
                          id='logo_url'
                          type='text'
                          className='form-input w-full'
                          value={form.logo_url}
                          onChange={e =>
                            handleChange(e.target.value, 'logo_url')
                          }
                          placeholder='Enter logo URL'
                        />
                      </div>

                      {/* Description */}
                      <div className='md:col-span-2'>
                        <label
                          htmlFor='description'
                          className='mb-2 block text-sm font-medium'
                        >
                          Description <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                          id='description'
                          className={`form-textarea w-full ${
                            emptyField.includes('description')
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={form.description}
                          onChange={e =>
                            handleChange(e.target.value, 'description')
                          }
                          placeholder='Enter tenant description'
                          rows={3}
                        />
                      </div>

                      {/* Max Users */}
                      <div>
                        <label
                          htmlFor='max_users'
                          className='mb-2 block text-sm font-medium'
                        >
                          Max Users <span className='text-red-500'>*</span>
                        </label>
                        <input
                          id='max_users'
                          type='number'
                          className={`form-input w-full ${
                            emptyField.includes('max_users')
                              ? 'border-red-500'
                              : ''
                          }`}
                          value={form.max_users}
                          onChange={e =>
                            handleChange(
                              parseInt(e.target.value) || '',
                              'max_users',
                            )
                          }
                          placeholder='Enter maximum users allowed'
                          min='1'
                        />
                      </div>

                      {/* Conditionally display subscription fields only for creating tenants */}
                      {!isEdit && (
                        <>
                          {/* Subscription Plan */}
                          <div>
                            <label
                              htmlFor='subscription_plan'
                              className='mb-2 block text-sm font-medium'
                            >
                              Subscription Plan{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <Select
                              id='subscription_plan'
                              className={`${
                                emptyField.includes('subscription_plan')
                                  ? 'rounded-md border-red-500'
                                  : ''
                              }`}
                              options={subscriptionPlans}
                              value={subscriptionPlans.find(
                                plan => plan.value === form.subscription_plan,
                              )}
                              onChange={selectedOption =>
                                handleChange(
                                  selectedOption?.value || '',
                                  'subscription_plan',
                                )
                              }
                              placeholder='Select subscription plan'
                            />
                          </div>

                          {/* Subscription Start Date */}
                          <div>
                            <label
                              htmlFor='subscription_start_date'
                              className='mb-2 block text-sm font-medium'
                            >
                              Subscription Start Date{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <DatePicker
                              id='subscription_start_date'
                              selected={form.subscription_start_date}
                              onChange={date =>
                                handleChange(date, 'subscription_start_date')
                              }
                              className={`form-input w-full ${
                                emptyField.includes('subscription_start_date')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                              dateFormat='yyyy-MM-dd'
                              placeholderText='Select start date'
                            />
                          </div>

                          {/* Subscription End Date */}
                          <div>
                            <label
                              htmlFor='subscription_end_date'
                              className='mb-2 block text-sm font-medium'
                            >
                              Subscription End Date{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <DatePicker
                              id='subscription_end_date'
                              selected={form.subscription_end_date}
                              onChange={date =>
                                handleChange(date, 'subscription_end_date')
                              }
                              className={`form-input w-full ${
                                emptyField.includes('subscription_end_date')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                              dateFormat='yyyy-MM-dd'
                              placeholderText='Select end date'
                              minDate={
                                form.subscription_start_date || new Date()
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* Active Status */}
                      <div className='flex items-center'>
                        <input
                          id='is_active'
                          type='checkbox'
                          className='form-checkbox h-5 w-5'
                          checked={form.is_active}
                          onChange={e =>
                            handleChange(e.target.checked, 'is_active')
                          }
                        />
                        <label
                          htmlFor='is_active'
                          className='ml-2 text-sm font-medium'
                        >
                          Active Tenant
                        </label>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className='mt-8 flex justify-end gap-4'>
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
                        className='btn btn-primary'
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <IconLoader className='inline-block h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2' />
                            {isEdit ? 'Updating...' : 'Creating...'}
                          </>
                        ) : isEdit ? (
                          'Update Tenant'
                        ) : (
                          'Create Tenant'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalTenant;
