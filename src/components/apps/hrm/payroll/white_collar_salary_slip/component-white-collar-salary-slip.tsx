'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { writeCurrency } from '@/lib/money';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WhiteCollarSalarySlipTable from '@/components/apps/hrm/payroll/white_collar_salary_slip/_components/white-collar-salary-slip-table'; // Ensure the correct import

import { useGetAllEmployeeSalarySlipsWhite } from '@/app/api/hooks/hrm/salary_slip/useGetAllSalarySlip';

type SelectedOption = {
  value: string;
  label: string;
};

type SalarySlip = {
  employee_id: number;
  pkid: number;
  month: string;
  year: number;
  status: string;
  gaji_take_home: number;
  benefit_bpjs_kesehatan: number;
  benefit_bpjs_tk_jht: number;
  benefit_bpjs_tk_jkk: number;
  benefit_bpjs_tk_jkm: number;
  benefit_bpjs_tk_jp: number;
  tunjangan_pph: number;
};

type Item = SalarySlip & {
  fullname: string;
};

const ComponentsWhiteCollarSalarySlip = () => {
  const pathname = usePathname();
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: combinedData, isLoading } = useGetAllEmployeeSalarySlipsWhite();

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handleEmployeeChange = (
    selectedOption: SingleValue<SelectedOption>,
  ) => {
    setSelectedEmployee(selectedOption ? selectedOption.value : null);
  };

  const handleYearChange = (selectedOption: SingleValue<SelectedOption>) => {
    setSelectedYear(selectedOption ? selectedOption.value : null);
  };

  const handleMonthChange = (selectedOption: SingleValue<SelectedOption>) => {
    setSelectedMonth(selectedOption ? selectedOption.value : null);
  };

  const handleStatusChange = (selectedOption: SingleValue<SelectedOption>) => {
    setSelectedStatus(selectedOption ? selectedOption.value : null);
  };

  const filteredData = combinedData
    ?.filter((item: Item) => {
      return (
        (!selectedEmployee ||
          item.employee_id?.toString() === selectedEmployee) &&
        (!selectedYear || item.year?.toString() === selectedYear) &&
        (!selectedMonth || item.month === selectedMonth) &&
        (!selectedStatus || item.status === selectedStatus)
      );
    })
    ?.map((item: Item) => {
      const newItem = {
        ...item,
        gaji_take_home: handleWriteCurrency(Number(item.gaji_take_home)),
        ditanggung_perusahaan: handleWriteCurrency(
          Number(item.tunjangan_pph) +
            Number(item.benefit_bpjs_kesehatan) +
            Number(item.benefit_bpjs_tk_jht) +
            Number(item.benefit_bpjs_tk_jkk) +
            Number(item.benefit_bpjs_tk_jkm) +
            Number(item.benefit_bpjs_tk_jp),
        ),
      };
      return newItem;
    });

  const employeeOptions = Array.from(
    new Map(
      combinedData
        ?.filter(
          (item: Item) => item.employee_id != null && item.fullname != null,
        )
        .map((item: Item) => [
          item.employee_id,
          { value: item.employee_id.toString(), label: item.fullname },
        ]),
    ).values(),
  );

  const monthOptions = [
    { value: 'Januari', label: 'Januari' },
    { value: 'Februari', label: 'Februari' },
    { value: 'Maret', label: 'Maret' },
    { value: 'April', label: 'April' },
    { value: 'Mei', label: 'Mei' },
    { value: 'Juni', label: 'Juni' },
    { value: 'Juli', label: 'Juli' },
    { value: 'Agustus', label: 'Agustus' },
    { value: 'September', label: 'September' },
    { value: 'Oktober', label: 'Oktober' },
    { value: 'November', label: 'November' },
    { value: 'Desember', label: 'Desember' },
  ];

  const yearOptions = Array.from(
    new Set<string>(
      Array.isArray(combinedData)
        ? combinedData
            .filter((item: Item) => item.year != null)
            .map((item: Item) => item.year.toString())
        : [],
    ),
  )
    .sort()
    .map((year: string) => ({
      value: year,
      label: year,
    }));

  const statusOptions = [
    { value: 'Not Written In Journal', label: 'Not Written In Journal' },
    { value: 'Written In Journal', label: 'Written In Journal' },
    { value: 'Paid', label: 'Paid' },
  ];

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <div className='z-999 w-100 flex gap-4'>
          <div className='w-full'>
            <label className='mb-1 block'>Karyawan</label>
            <Select
              options={employeeOptions}
              onChange={handleEmployeeChange}
              isClearable
              placeholder='Select Employee'
            />
          </div>
          <div className='w-full'>
            <label className='mb-1 block'>Bulan</label>
            <Select
              options={monthOptions}
              onChange={handleMonthChange}
              isClearable
              placeholder='Select Month'
            />
          </div>
          <div className='w-full'>
            <label className='mb-1 block'>Tahun</label>
            <Select
              options={yearOptions}
              onChange={handleYearChange}
              isClearable
              placeholder='Select Year'
            />
          </div>
          <div className='w-full'>
            <label className='mb-1 block'>Status</label>
            <Select
              options={statusOptions}
              onChange={handleStatusChange}
              isClearable
              placeholder='Select Status'
            />
          </div>
        </div>
        <div className='z-0'>
          <WhiteCollarSalarySlipTable
            data={filteredData || []}
            isLoading={isLoading}
          />
        </div>
        {/* <div className='my-2 flex justify-end'>
          <button className='btn btn-primary'>
            Bayar Semua Slip Sesuai Filter
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ComponentsWhiteCollarSalarySlip;
