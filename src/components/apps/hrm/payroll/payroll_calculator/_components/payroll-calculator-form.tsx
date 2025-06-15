import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { useGetAllEmployeeWhite } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';

const months = [
  { value: '0', label: 'Januari' },
  { value: '1', label: 'Februari' },
  { value: '2', label: 'Maret' },
  { value: '3', label: 'April' },
  { value: '4', label: 'Mei' },
  { value: '5', label: 'Juni' },
  { value: '6', label: 'Juli' },
  { value: '7', label: 'Agustus' },
  { value: '8', label: 'September' },
  { value: '9', label: 'Oktober' },
  { value: '10', label: 'November' },
  { value: '11', label: 'Desember' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2022 }, (_, i) => ({
  value: 2023 + i,
  label: `${2023 + i}`,
}));

interface Employee {
  pkid: number;
  fullname: string;
}

interface FormState {
  karyawan: { value: number; label: string } | null;
  bulan: { value: string; label: string } | null;
  tahun: { value: number; label: string } | null;
  gajiBulanan: string;
  penalti: string;
}

const PayrollCalculator = () => {
  const { data: employeeData, isLoading } = useGetAllEmployeeWhite();
  const [form, setForm] = useState<FormState>({
    karyawan: null,
    bulan: null,
    tahun: null,
    gajiBulanan: '',
    penalti: '',
  });

  const employeeOptions =
    employeeData?.data.map((employee: Employee) => ({
      value: employee.pkid,
      label: employee.fullname,
    })) || [];

  const handleSelectChange = (
    value: SingleValue<{ value: string | number; label: string }>,
    field: keyof FormState,
  ) => {
    setForm({ ...form, [field]: value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormState,
  ) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.karyawan || !form.bulan || !form.tahun || !form.gajiBulanan) {
      Swal.fire('Error!', 'Semua field harus diisi', 'error');
      return;
    }
    const bodyData = {
      gaji_pokok: form.gajiBulanan,
      penalti: form.penalti,
      employee_id: form.karyawan?.value,
      month: form.bulan.value,
      year: form.tahun.value,
    };

    const bodyDataJSON = JSON.stringify(bodyData);

    localStorage.setItem('calculate_payroll', bodyDataJSON);

    window.location.href = `/hrm/payroll/payroll_calculator/result`;
  };

  return (
    <div className='mx-auto p-6'>
      <h2 className='mb-4 text-2xl font-bold'>Kalkulator Penggajian</h2>
      <div className='mb-4'>
        <label className='mb-1 block'>Karyawan</label>
        <Select
          value={form.karyawan}
          onChange={value => handleSelectChange(value, 'karyawan')}
          options={employeeOptions}
          isLoading={isLoading}
          className='w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='mb-1 block'>Bulan</label>
        <Select
          value={form.bulan}
          onChange={value => handleSelectChange(value, 'bulan')}
          options={months}
          className='w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='mb-1 block'>Tahun</label>
        <Select
          value={form.tahun}
          onChange={value => handleSelectChange(value, 'tahun')}
          options={years}
          className='w-full'
        />
      </div>
      <div className='mb-4'>
        <label className='mb-1 block'>Gaji Bulanan</label>
        <input
          type='number'
          value={form.gajiBulanan}
          onChange={e => handleInputChange(e, 'gajiBulanan')}
          className='form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm'
          min='0'
        />
      </div>
      <div className='mb-4'>
        <label className='mb-1 block'>Penalti</label>
        <input
          type='number'
          value={form.penalti}
          onChange={e => handleInputChange(e, 'penalti')}
          className='form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm'
          min='0'
        />
      </div>
      <div className='flex justify-end'>
        <button
          type='submit'
          className='btn btn-primary'
          onClick={handleSubmit}
        >
          Kalkulasi
        </button>
      </div>
    </div>
  );
};

export default PayrollCalculator;
