import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';
import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateAsset } from '@/app/api/hooks/fixed_asset/asset_list/useCreateAsset';
import { useGetAssetById } from '@/app/api/hooks/fixed_asset/asset_list/useGetAssetById';
import { useUpdateAsset } from '@/app/api/hooks/fixed_asset/asset_list/useUpdateAsset';
import { assetListInitialState } from '@/helpers/utils/fixed_asset/asset_list';
import {
  assetTypeOptions,
  getFilteredConditionStatus,
} from '@/helpers/utils/global/listStatus';

const { t } = getTranslation();

const AssetStatus = [
  { value: 'aktif', label: t('active'), color: 'success' },
  { value: 'tidak_layak', label: t('unfit_for_use'), color: 'danger' },
  {
    value: 'menunggu_perbaikan',
    label: t('awaiting_repair'),
    color: 'warning',
  },
  { value: 'dalam_perbaikan', label: t('under_repair'), color: 'black' },
];

interface IModalAssetProps {
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

const ModalListAsset = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalAssetProps) => {
  const { mutateAsync: createListType } = useCreateAsset();
  const { mutateAsync: updateListType } = useUpdateAsset();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [isAuto, setIsAuto] = useState(false);
  const [form, setForm] = useState(assetListInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'pkid',
      'purchase_date',
      'description',
      'office_pkid',
      'office_name',
      'is_deleted',
    ] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === 0 ||
        temp[field as keyof typeof temp] === undefined
      ) {
        requiredField.push(field);
      }
    });
    if (requiredField.length > 0) {
      setEmptyField(requiredField);
      return false;
    }
    return true;
  };

  const {
    data: listTypeDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetById(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (listTypeDetail && modalEdit) {
      setForm(listTypeDetail);
    }
  }, [listTypeDetail, modalEdit]);

  const handleOnChange = (value: string | number, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(assetListInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(assetListInitialState);
      setEmptyField([]);
      setIsAuto(false);
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
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            setForm(assetListInitialState);
            setEmptyField([]);
            setIsAuto(false);
          } catch (error) {
            Swal.fire('Error!', t('error_occurred'), 'error');
            setIsAuto(false);
          }
        }
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAuto(checked);

    setForm(prevForm => ({
      ...prevForm,
      asset_code: checked ? 'auto' : '',
    }));
  };

  const handleSubmit = async () => {
    const isMandatoryFilled = mandatoryValidation();
    const fieldTranslations: Record<string, string> = {
      asset_code: t('asset_code'),
      asset_type: t('asset_type'),
      condition: t('condition'),
      status: t('status'),
      description: t('description'),
      age: t('asset_age'),
      specification: t('asset_specification'),
      manufacturer: t('asset_manufacturer'),
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
            if (modalEdit) {
              const description = `Merupakan aset bertipe ${form.asset_type} dengan spesifikasi ${form.specification}, di produksi oleh ${form.manufacturer}, dengan usia ${form.age} bulan.`;

              const tempForm = { ...form, description };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateListType({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              const description = `Merupakan aset bertipe ${form.asset_type} dengan spesifikasi ${form.specification}, di produksi oleh ${form.manufacturer}, dengan usia ${form.age} bulan.`;

              const {
                asset_code,
                asset_type,
                purchase_date,
                condition,
                status,
                age,
                specification,
                manufacturer,
              } = form;
              await createListType({
                asset_code: asset_code ?? 'auto',
                asset_type: asset_type ?? '',
                purchase_date: purchase_date ?? '',
                condition: condition ?? '',
                status: status ?? '',
                description,
                age: age ?? 1,
                specification: specification || '',
                manufacturer: manufacturer || '',
              });

              setModal(false);
            }
            setIsAuto(false);
            setForm(assetListInitialState);
            setEmptyField([]);
            Swal.fire(t('success'), t('asset_saved'), 'success').then(() => {
              refetch();
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
      setIsAuto(false);
      setForm(assetListInitialState);
    }
    if (modal) {
      setIsAuto(false);
      setModal(false);
    }
  };

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog
        as='div'
        open={modal || modalEdit}
        onClose={() => {
          if (modalEdit) {
            setModalEdit(true);
          }
          if (modal) {
            setModal(true);
          }
        }}
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
          <div className='fixed inset-0' />
        </Transition.Child>
        <div
          id='slideIn_down_modal'
          className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  {modal ? t('add_asset') : t('edit_asset')}
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
                  {modal && (
                    <div className='flex flex-col'>
                      <label htmlFor='autoCheckbox'>
                        {t('auto_generate_asset_id')}
                      </label>
                      <input
                        id='autoCheckbox'
                        type='checkbox'
                        checked={isAuto}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor='assetCode'>
                      {t('asset_id')}
                      <span style={{ color: 'red' }} hidden={!modal}>
                        *
                      </span>
                    </label>
                    <input
                      id='assetCode'
                      name='assetCode'
                      type='text'
                      placeholder='Asset ID'
                      className='form-input'
                      value={form.asset_code || ''}
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'asset_code')
                      }
                      disabled={!modal || isAuto}
                      style={{
                        borderColor: emptyField.includes('asset_code')
                          ? 'red'
                          : '',
                        backgroundColor: isAuto || !modal ? '#f0f0f0' : '',
                        color: isAuto || !modal ? '#b0b1b1' : '',
                      }}
                    />
                  </div>
                  <label htmlFor='assetType'>
                    {t('asset_type')}
                    <span style={{ color: 'red' }} hidden={!modal}>
                      *
                    </span>
                  </label>
                  <Select
                    id='assetType'
                    name='assetType'
                    placeholder={t('select_asset_type')}
                    className='basic-single'
                    options={assetTypeOptions}
                    isSearchable={true}
                    isClearable={true}
                    maxMenuHeight={150}
                    menuPlacement='top'
                    isDisabled={!modal}
                    styles={{
                      menu: provided => ({
                        ...provided,
                        zIndex: 9999, // Set a high z-index value
                      }),
                      control: provided => ({
                        ...provided,
                        borderColor: emptyField.includes('asset_type')
                          ? 'red'
                          : '',
                      }),
                    }}
                    onChange={(selectedOption: SelectedOption | null) =>
                      handleOnChange(selectedOption?.value || '', 'asset_type')
                    }
                    value={
                      form.asset_type
                        ? {
                            value: form.asset_type ?? '',
                            label: form.asset_type ?? '',
                          }
                        : null
                    }
                  />
                  <label htmlFor='purchase_date'>
                    {t('purchase_date')}
                    <span style={{ color: 'red' }} hidden={!modal}>
                      *
                    </span>
                  </label>
                  <Flatpickr
                    id='purchase_date'
                    name='purchase_date'
                    placeholder='Pilih Tanggal'
                    options={{
                      dateFormat: 'd-m-Y',
                      position: isRtl ? 'auto right' : 'auto left',
                    }}
                    className='form-input'
                    onChange={date =>
                      handleOnChange(
                        date[0] ? date[0].toLocaleDateString('en-CA') : '',
                        'purchase_date',
                      )
                    }
                    value={form.purchase_date || ''}
                    style={
                      modal
                        ? {
                            borderColor: emptyField.includes('purchase_date')
                              ? 'red'
                              : '',
                          }
                        : {
                            background: '#f0f0f0',
                            color: '#b0b1b1',
                          }
                    }
                    disabled={!modal}
                  />
                  <label htmlFor='status'>
                    {t('status')}
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    id='status'
                    name='status'
                    placeholder={t('select_status')}
                    className='basic-single'
                    options={AssetStatus}
                    isSearchable={true}
                    isClearable={true}
                    maxMenuHeight={150}
                    menuPlacement='top'
                    styles={{
                      menu: provided => ({
                        ...provided,
                        zIndex: 9999, // Set a high z-index value
                      }),
                      control: provided => ({
                        ...provided,
                        borderColor: emptyField.includes('status') ? 'red' : '',
                      }),
                    }}
                    onChange={(selectedOption: SelectedOption | null) =>
                      handleOnChange(selectedOption?.value || '', 'status')
                    }
                    value={
                      form.status
                        ? {
                            value: form.status ?? '',
                            label: form.status ?? '',
                          }
                        : null
                    }
                  />
                  <label htmlFor='condition'>
                    {t('condition')}
                    <span style={{ color: 'red' }}>*</span>
                  </label>
                  <Select
                    id='condition'
                    name='condition'
                    placeholder={t('select_condition')}
                    className='basic-single'
                    options={getFilteredConditionStatus(form.status || '')}
                    isSearchable={true}
                    isClearable={true}
                    maxMenuHeight={150}
                    menuPlacement='top'
                    styles={{
                      menu: provided => ({
                        ...provided,
                        zIndex: 9999, // Set a high z-index value
                      }),
                      control: provided => ({
                        ...provided,
                        borderColor: emptyField.includes('condition')
                          ? 'red'
                          : '',
                      }),
                    }}
                    onChange={(selectedOption: SelectedOption | null) =>
                      handleOnChange(selectedOption?.value || '', 'condition')
                    }
                    value={
                      form.condition
                        ? {
                            value: form.condition ?? '',
                            label: form.condition ?? '',
                          }
                        : null
                    }
                  />
                  <div className='space-y-5'>
                    <label htmlFor='assetSpec'>
                      {t('asset_specification')}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='assetSpec'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'specification')
                      }
                      type='text'
                      value={form.specification || ''}
                      className='form-input'
                      placeholder='Masukkan spesifikasi asset...'
                      style={{
                        borderColor: emptyField.includes('specification')
                          ? 'red'
                          : '',
                      }}
                    />
                    <label htmlFor='assetManufacturer'>
                      {t('asset_manufacturer')}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='assetManufacturer'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'manufacturer')
                      }
                      type='text'
                      value={form.manufacturer || ''}
                      className='form-input'
                      placeholder='Masukkan manufaktur asset...'
                      style={{
                        borderColor: emptyField.includes('manufacturer')
                          ? 'red'
                          : '',
                      }}
                    />
                    <label htmlFor='assetAge'>
                      {t('asset_age')}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='assetAge'
                      onChange={e =>
                        handleOnChange(Number(e.target.value), 'age')
                      }
                      type='number'
                      value={form.age || ''}
                      className='form-input'
                      placeholder='Masukkan usia asset (bulan)...'
                      style={{
                        borderColor: emptyField.includes('age') ? 'red' : '',
                      }}
                    />
                  </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
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
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
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

export default ModalListAsset;
