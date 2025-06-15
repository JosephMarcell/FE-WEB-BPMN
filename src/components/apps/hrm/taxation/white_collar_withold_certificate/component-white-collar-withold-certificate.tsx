'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WhiteCollarWitholdCertificateTable from '@/components/apps/hrm/taxation/white_collar_withold_certificate/_components/white-collar-withold-certificate-table';

import { useGetAllEmployeeWhite } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useGetAllWhiteCollarWitholdCertificate } from '@/app/api/hooks/hrm/white_collar_withold_certificate/useGetAllWhiteCollarWitholdCertificate';

type SelectedOption = {
  value: string;
  label: string;
};

type Item = {
  pkid: number;
  employee_id: number;
  // month: string;
  year: number;
  status: string;
  fullname: string;
};

const ComponentsWhiteCollarWitholdCertificate = () => {
  const pathname = usePathname();
  const {
    data: listCategory,
    isLoading,
    refetch,
  } = useGetAllWhiteCollarWitholdCertificate();
  const { data: employees } = useGetAllEmployeeWhite();

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleEmployeeChange = (
    selectedOption: SingleValue<SelectedOption>,
  ) => {
    setSelectedEmployee(selectedOption ? selectedOption.value : null);
  };

  const handleYearChange = (selectedOption: SingleValue<SelectedOption>) => {
    setSelectedYear(selectedOption ? selectedOption.value : null);
  };

  const handleStatusChange = (selectedOption: SingleValue<SelectedOption>) => {
    setSelectedStatus(selectedOption ? selectedOption.value : null);
  };

  const employeeOptions = useMemo(
    () =>
      employees?.data.map((employee: { pkid: number; fullname: string }) => ({
        value: employee.pkid.toString(),
        label: employee.fullname,
      })),
    [employees],
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set<string>(
          listCategory?.map((item: Item) => item.year.toString()),
        ),
      )
        .sort()
        .map((year: string) => ({
          value: year,
          label: year,
        })),
    [listCategory],
  );

  const statusOptions = [
    { value: 'Not Verified', label: 'Not Verified' },
    { value: 'Verified', label: 'Verified' },
  ];

  const filteredData = useMemo(
    () =>
      listCategory
        ?.map((item: Item) => ({
          ...item,
          fullname:
            employees?.data.find(
              (emp: { pkid: number }) => emp.pkid === item.employee_id,
            )?.fullname || '',
          year: item.year.toString().replace(/\./g, ''),
          status: item.status,
        }))
        .filter((item: Item) => {
          return (
            (!selectedEmployee ||
              item.employee_id.toString() === selectedEmployee) &&
            (!selectedYear || item.year.toString() === selectedYear) &&
            (!selectedStatus || item.status === selectedStatus) &&
            item.fullname !== ''
          );
        }),
    [listCategory, employees, selectedEmployee, selectedYear, selectedStatus],
  );

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
          <WhiteCollarWitholdCertificateTable
            data={filteredData}
            isLoading={isLoading}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentsWhiteCollarWitholdCertificate;
