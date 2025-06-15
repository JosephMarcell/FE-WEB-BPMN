import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { useGetSalaryPercentage } from '@/app/api/hooks/hrm/salary_percentage/useGetSalaryPercentage';
import { useUpdateSalaryPercentage } from '@/app/api/hooks/hrm/salary_percentage/useUpdateSalaryPercentage';
import {
  salaryPercentageInitialState,
  SalaryPercentageProperty,
} from '@/helpers/utils/hrm/salary_percentage';

interface OptionType {
  value: string;
  label: string;
}

const typeOptions = [
  { value: 'Persentase', label: 'Persentase' },
  { value: 'Nominal', label: 'Nominal' },
];

const slipGajiOptions = [
  { value: 'Ya', label: 'Ya' },
  { value: 'Tidak', label: 'Tidak' },
];

const BPJSForm = () => {
  const { data: listBPJS, refetch } = useGetSalaryPercentage();
  const { mutateAsync: updateBPJS } = useUpdateSalaryPercentage();

  const [form, setForm] = useState<SalaryPercentageProperty>(
    salaryPercentageInitialState,
  );

  useEffect(() => {
    if (listBPJS !== undefined) {
      setForm(listBPJS.data);
    }
  }, [listBPJS]);

  const handleOnChange = (value: string | number | boolean, key: string) => {
    setForm({ ...form, [key]: value });
  };

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'created_by',
      'created_date',
      'created_host',
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
    ];
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
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all fields',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            await updateBPJS({
              pkid: form.pkid,
              data: form,
            });

            Swal.fire(
              'Saved!',
              'Your BPJS percentage has been saved.',
              'success',
            ).then(() => {
              refetch();
            });
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  return (
    <main className='relative p-4'>
      <div>
        <h2 className='mb-4 text-xl font-bold'>BPJS</h2>

        <div className='mb-6'>
          <h3 className='mb-2 text-lg font-semibold'>BPJS Kesehatan</h3>
          <div className='mb-4'>
            <label className='mb-1 block'>Tipe</label>
            <Select
              value={{
                value: form.bpjs_kesehatan_type,
                label: form.bpjs_kesehatan_type,
              }}
              onChange={(selectedOption: OptionType | null) =>
                handleOnChange(
                  selectedOption?.value || '',
                  'bpjs_kesehatan_type',
                )
              }
              options={typeOptions}
              isDisabled={
                !form.is_adding_bpjs_kesehatan ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`${
                !form.is_adding_bpjs_kesehatan
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Perusahaan</label>
            <input
              type='number'
              value={form.bpjs_kesehatan_perusahaan}
              onChange={e =>
                handleOnChange(e.target.value, 'bpjs_kesehatan_perusahaan')
              }
              disabled={
                !form.is_adding_bpjs_kesehatan ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_kesehatan
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Pribadi</label>
            <input
              type='number'
              value={form.bpjs_kesehatan_pribadi}
              onChange={e =>
                handleOnChange(e.target.value, 'bpjs_kesehatan_pribadi')
              }
              disabled={
                !form.is_adding_bpjs_kesehatan ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_kesehatan
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Tambahkan Pada Slip Gaji</label>
            <Select
              value={{
                value: form.is_adding_bpjs_kesehatan ? 'Ya' : 'Tidak',
                label: form.is_adding_bpjs_kesehatan ? 'Ya' : 'Tidak',
              }}
              onChange={(selectedOption: OptionType | null) => {
                if (selectedOption) {
                  handleOnChange(
                    selectedOption?.value === 'Ya' ? true : false,
                    'is_adding_bpjs_kesehatan',
                  );
                }
              }}
              isDisabled={listBPJS?.headers['can_update'] === 'false'}
              options={slipGajiOptions}
            />
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            BPJS Ketenagakerjaan JHT
          </h3>
          <div className='mb-4'>
            <label className='mb-1 block'>Tipe</label>
            <Select
              value={{
                value: form.bpjs_ketenagakerjaan_jht_type,
                label: form.bpjs_ketenagakerjaan_jht_type,
              }}
              onChange={(selectedOption: OptionType | null) =>
                handleOnChange(
                  selectedOption?.value || '',
                  'bpjs_ketenagakerjaan_jht_type',
                )
              }
              options={typeOptions}
              isDisabled={
                !form.is_adding_bpjs_ketenagakerjaan_jht ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`${
                !form.is_adding_bpjs_ketenagakerjaan_jht
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Perusahaan</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jht_perusahaan}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jht_perusahaan',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jht ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jht
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Pribadi</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jht_pribadi}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jht_pribadi',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jht ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jht
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Tambahkan Pada Slip Gaji</label>
            <Select
              value={{
                value: form.is_adding_bpjs_ketenagakerjaan_jht ? 'Ya' : 'Tidak',
                label: form.is_adding_bpjs_ketenagakerjaan_jht ? 'Ya' : 'Tidak',
              }}
              onChange={(selectedOption: OptionType | null) => {
                if (selectedOption) {
                  handleOnChange(
                    selectedOption?.value === 'Ya' ? true : false,
                    'is_adding_bpjs_ketenagakerjaan_jht',
                  );
                }
              }}
              isDisabled={listBPJS?.headers['can_update'] === 'false'}
              options={slipGajiOptions}
            />
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            BPJS Ketenagakerjaan JKK
          </h3>
          <div className='mb-4'>
            <label className='mb-1 block'>Tipe</label>
            <Select
              value={{
                value: form.bpjs_ketenagakerjaan_jkk_type,
                label: form.bpjs_ketenagakerjaan_jkk_type,
              }}
              onChange={(selectedOption: OptionType | null) =>
                handleOnChange(
                  selectedOption?.value || '',
                  'bpjs_ketenagakerjaan_jkk_type',
                )
              }
              options={typeOptions}
              isDisabled={
                !form.is_adding_bpjs_ketenagakerjaan_jkk ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`${
                !form.is_adding_bpjs_ketenagakerjaan_jkk
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Perusahaan</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jkk_perusahaan}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jkk_perusahaan',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jkk ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jkk
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Tambahkan Pada Slip Gaji</label>
            <Select
              value={{
                value: form.is_adding_bpjs_ketenagakerjaan_jkk ? 'Ya' : 'Tidak',
                label: form.is_adding_bpjs_ketenagakerjaan_jkk ? 'Ya' : 'Tidak',
              }}
              onChange={(selectedOption: OptionType | null) => {
                if (selectedOption) {
                  handleOnChange(
                    selectedOption?.value === 'Ya' ? true : false,
                    'is_adding_bpjs_ketenagakerjaan_jkk',
                  );
                }
              }}
              isDisabled={listBPJS?.headers['can_update'] === 'false'}
              options={slipGajiOptions}
            />
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            BPJS Ketenagakerjaan JKM
          </h3>
          <div className='mb-4'>
            <label className='mb-1 block'>Tipe</label>
            <Select
              value={{
                value: form.bpjs_ketenagakerjaan_jkm_type,
                label: form.bpjs_ketenagakerjaan_jkm_type,
              }}
              onChange={(selectedOption: OptionType | null) =>
                handleOnChange(
                  selectedOption?.value || '',
                  'bpjs_ketenagakerjaan_jkm_type',
                )
              }
              options={typeOptions}
              isDisabled={
                !form.is_adding_bpjs_ketenagakerjaan_jkm ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`${
                !form.is_adding_bpjs_ketenagakerjaan_jkm
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Perusahaan</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jkm_perusahaan}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jkm_perusahaan',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jkm ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jkm
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Tambahkan Pada Slip Gaji</label>
            <Select
              value={{
                value: form.is_adding_bpjs_ketenagakerjaan_jkm ? 'Ya' : 'Tidak',
                label: form.is_adding_bpjs_ketenagakerjaan_jkm ? 'Ya' : 'Tidak',
              }}
              onChange={(selectedOption: OptionType | null) => {
                if (selectedOption) {
                  handleOnChange(
                    selectedOption?.value === 'Ya' ? true : false,
                    'is_adding_bpjs_ketenagakerjaan_jkm',
                  );
                }
              }}
              isDisabled={listBPJS?.headers['can_update'] === 'false'}
              options={slipGajiOptions}
            />
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='mb-2 text-lg font-semibold'>
            BPJS Ketenagakerjaan JP
          </h3>
          <div className='mb-4'>
            <label className='mb-1 block'>Tipe</label>
            <Select
              value={{
                value: form.bpjs_ketenagakerjaan_jp_type,
                label: form.bpjs_ketenagakerjaan_jp_type,
              }}
              onChange={(selectedOption: OptionType | null) =>
                handleOnChange(
                  selectedOption?.value || '',
                  'bpjs_ketenagakerjaan_jp_type',
                )
              }
              options={typeOptions}
              isDisabled={
                !form.is_adding_bpjs_ketenagakerjaan_jp ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`${
                !form.is_adding_bpjs_ketenagakerjaan_jp
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Perusahaan</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jp_perusahaan}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jp_perusahaan',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jp ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jp
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Jumlah Ditanggung Pribadi</label>
            <input
              type='number'
              value={form.bpjs_ketenagakerjaan_jp_pribadi}
              onChange={e =>
                handleOnChange(
                  e.target.value,
                  'bpjs_ketenagakerjaan_jp_pribadi',
                )
              }
              disabled={
                !form.is_adding_bpjs_ketenagakerjaan_jp ||
                listBPJS?.headers['can_update'] === 'false'
              }
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                !form.is_adding_bpjs_ketenagakerjaan_jp
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : ''
              }`}
              min='0'
            />
          </div>
          <div className='mb-4'>
            <label className='mb-1 block'>Tambahkan Pada Slip Gaji</label>
            <Select
              value={{
                value: form.is_adding_bpjs_ketenagakerjaan_jp ? 'Ya' : 'Tidak',
                label: form.is_adding_bpjs_ketenagakerjaan_jp ? 'Ya' : 'Tidak',
              }}
              onChange={(selectedOption: OptionType | null) => {
                if (selectedOption) {
                  handleOnChange(
                    selectedOption?.value === 'Ya' ? true : false,
                    'is_adding_bpjs_ketenagakerjaan_jp',
                  );
                }
              }}
              options={slipGajiOptions}
              isDisabled={listBPJS?.headers['can_update'] === 'false'}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          {listBPJS?.headers['can_update'] === 'true' && (
            <button
              type='submit'
              className='btn btn-primary'
              onClick={handleSubmit}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default BPJSForm;
