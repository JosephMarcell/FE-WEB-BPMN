import { Dialog, Transition } from '@headlessui/react';
import { useParams } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';
import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateAssetMaintenance } from '@/app/api/hooks/fixed_asset/maintenance_log/useCreateAssetMaintenanceLog';
import { useGetAssetMaintenanceByPkid } from '@/app/api/hooks/fixed_asset/maintenance_log/useGetAssetMaintenanceByAssetId';
import { useUpdateAssetMaintenanceLog } from '@/app/api/hooks/fixed_asset/maintenance_log/useUpdateAssetMaintenanceLog';
import { assetMaintenanceLognitialState } from '@/helpers/utils/fixed_asset/asset_maintenance_log';

const { t } = getTranslation();

interface IModalAssetMaintenanceProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}

const assetMaintenanceLogOptions = [
  { value: 'Dalam Progress', label: t('in_progress'), color: 'warning' },
  { value: 'Belum Mulai', label: t('not_started'), color: 'danger' },
  { value: 'Selesai', label: t('completed'), color: 'success' },
];

const ModalAssetMaintenance = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalAssetMaintenanceProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const params = useParams();
  const pkidRaw = params.pkid;
  const model_pkid = Array.isArray(pkidRaw) ? pkidRaw[0] : pkidRaw;
  const log_pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const { mutateAsync: createMaintenanceLog } =
    useCreateAssetMaintenance(model_pkid);
  const { mutateAsync: updateMaintenanceLog } =
    useUpdateAssetMaintenanceLog(log_pkid);
  const [form, setForm] = useState(assetMaintenanceLognitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);

  const {
    data: assetMaintenanceDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetMaintenanceByPkid(log_pkid, modalEdit);

  useEffect(() => {
    if (
      assetMaintenanceDetail &&
      modalEdit &&
      !isLoading &&
      assetMaintenanceDetail
    ) {
      setForm(assetMaintenanceDetail); // Set form data when assetMaintenanceDetail is available
    }
  }, [assetMaintenanceDetail, isLoading, modalEdit, log_pkid]);

  useEffect(() => {
    if (log_pkid && modalEdit && !isLoading) {
      refetchDetail();
    }
  }, [log_pkid, modalEdit, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField: string[] = [];
    const excludeItemField = [
      'pkid',
      'log_pkid',
      'model_pkid',
      'model_name',
      'model_type',
      'user_pkid',
      'user_name',
      'office_pkid',
      'office_name',
      'created_by',
      'created_date',
      'created_host',
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'description',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (!temp[field as keyof typeof temp]) {
        requiredField.push(field);
      }
    });
    setEmptyField(requiredField);
    return requiredField.length === 0;
  };

  const handleOnChange = (value: string | number | Date, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    Swal.fire({
      title: t('are_you_sure'),
      text: t('not_revertable'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes_continue'),
      cancelButtonText: t('no_cancel'),
    }).then(async result => {
      if (result.isConfirmed) {
        setForm(assetMaintenanceLognitialState);
        setEmptyField([]);
        setModal(false);
        setModalEdit(false);
      }
    });
  };

  const handleSubmit = async () => {
    const isMandatoryFilled = mandatoryValidation();
    const fieldTranslations: Record<string, string> = {
      maintenance_start: t('maintenance_start'),
      maintenance_end: t('maintenance_end'),
      maintenance_type: t('maintenance_type'),
      status: t('status'),
      description: t('description'),
    };

    // Map the empty field names to their translations
    const translatedEmptyFields = emptyField
      .map(field => fieldTranslations[field] || field) // If no translation found, keep the original field name
      .join(', ');

    if (!isMandatoryFilled) {
      Swal.fire({
        title: t('empty_field'),
        text: t('please_fill') + ` ${translatedEmptyFields}!`,
        icon: 'error',
        confirmButtonText: t('close'),
      });
    } else {
      Swal.fire({
        title: t('are_you_sure'),
        text: t('not_revertable'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes_continue'),
        cancelButtonText: t('no_cancel'),
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            // For editing an existing maintenance log
            if (modalEdit) {
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm); // Exclude unnecessary attributes

              await updateMaintenanceLog({
                log_pkid: log_pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }

            // For creating a new maintenance log
            if (modal) {
              const {
                maintenance_start,
                maintenance_end,
                maintenance_type,
                status,
                description,
              } = form;

              const newMaintenanceLog = {
                maintenance_start: maintenance_start ?? '',
                maintenance_end: maintenance_end ?? '',
                maintenance_type: maintenance_type ?? '', // Default to 'ANNUAL'
                status: status ?? 'PENDING', // Default to 'PENDING'
                description,
              };

              await createMaintenanceLog(newMaintenanceLog);

              setModal(false);
            }

            setForm(assetMaintenanceLognitialState); // Reset form to initial state
            setEmptyField([]); // Reset empty field list
            Swal.fire(t('success'), t('log_saved'), 'success').then(() => {
              refetch(); // Trigger refetch for fresh data
            });
          } catch (error) {
            Swal.fire('Error!', t('error_occurred'), 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(assetMaintenanceLognitialState); // Reset form on close if in edit mode
    }
    if (modal) {
      setModal(false); // Close the modal if it's in create mode
    }
  };

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog as='div' open={modal || modalEdit} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0' />
        </Transition.Child>
        <div className='fixed inset-0 z-[998] overflow-y-auto bg-black/60'>
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  {modal ? t('add_maintenance_log') : t('edit_maintenance_log')}
                </h5>
                <button
                  onClick={handleClose}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5'>
                <div className='space-y-5'>
                  <div className='flex flex-row gap-4'>
                    <div className='flex flex-1 flex-col'>
                      <label htmlFor='maintenance_start'>
                        {t('maintenance_start')}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='maintenance_start'
                        name='maintenance_start'
                        placeholder={t('select_date')}
                        options={{
                          dateFormat: 'd-m-Y',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'maintenance_start')
                        }
                        value={form.maintenance_start || ''}
                        style={{
                          borderColor: emptyField.includes('maintenance_start')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <label htmlFor='maintenance_end'>
                        {t('maintenance_end')}
                        <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='maintenance_end'
                        name='maintenance_end'
                        placeholder={t('select_date')}
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date =>
                          handleOnChange(date[0], 'maintenance_end')
                        }
                        value={form.maintenance_end || ''}
                        style={{
                          borderColor: emptyField.includes('maintenance_end')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='maintenance_type'>
                      {t('maintenance_type')}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='maintenance_type'
                      name='maintenance_type'
                      type='text'
                      placeholder={t('enter_maintenance_type')}
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'maintenance_type')
                      }
                      value={form.maintenance_type || ''}
                      style={{
                        borderColor: emptyField.includes('maintenance_type')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor='status'>
                      {t('status')}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      options={assetMaintenanceLogOptions}
                      value={
                        form.status
                          ? { label: form.status, value: form.status } // Ensure the value field is also populated
                          : undefined
                      } // If no status, pass undefined instead of an empty string
                      onChange={(selectedOption: SelectedOption | null) =>
                        handleOnChange(selectedOption?.value || '', 'status')
                      }
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor: emptyField.includes('status')
                            ? 'red'
                            : '',
                        }),
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor='description'>{t('description')}</label>
                    <textarea
                      id='description'
                      name='description'
                      placeholder={t('enter_description')}
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'description')
                      }
                      value={form.description || ''}
                    />
                  </div>
                </div>

                <div className='mt-5 flex gap-4'>
                  <button
                    onClick={handleCancel}
                    type='button'
                    className='btn btn-outline-danger'
                  >
                    {t('discard')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary'
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAssetMaintenance;
