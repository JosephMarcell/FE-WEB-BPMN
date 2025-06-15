import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import ModalPresenceBlue from '@/components/apps/hrm/work_time/presence_blue_operational/_components/modal-presence-blue';

import { IRootState } from '@/store';
import { setModalForm, setPkid } from '@/store/themeConfigSlice';

import { useGetAllEmployeeBlue } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useCountPresenceBlueHour } from '@/app/api/hooks/hrm/presence_blue/useCountPresenceBlueHour';
import { useRefreshPresenceBlueData } from '@/app/api/hooks/hrm/presence_blue/useRefreshPresenceBlueData';
import {
  CountHourPresenceBlueOutputProperty,
  PresenceBlueProperty,
} from '@/helpers/utils/hrm/presence_blue';
import { CountHourPresenceWhiteInputProperty } from '@/helpers/utils/hrm/presence_white';

interface Option {
  value: number;
  label: string;
}

interface Employee {
  pkid: number;
  fullname: string;
}

const months: Option[] = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2022 }, (_, i) => ({
  value: 2023 + i,
  label: `${2023 + i}`,
}));

const PresenceBlueInfo = () => {
  const dispatch = useDispatch();

  const { data: employeeData, isFetching } = useGetAllEmployeeBlue();
  const {
    data: refreshData,
    refetch: refetchRefreshData,
    isFetching: isFetchingRefresh,
  } = useRefreshPresenceBlueData();

  const {
    mutateAsync: countPresenceHour,
    data: resultCountPresenceHour,
    isPending,
  } = useCountPresenceBlueHour();

  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState<CountHourPresenceWhiteInputProperty>({
    employee_id: null,
    month: 1,
    year: new Date().getFullYear(),
  });

  const [result, setResult] = useState<CountHourPresenceBlueOutputProperty>({
    bukpotOutput: {
      work_hour: 0,
      penalty_hour: 0,
      allPresence: [],
    },
  });

  useEffect(() => {
    countPresenceHour(form);
  }, [form, countPresenceHour]);

  useEffect(() => {
    if (refreshData) {
      countPresenceHour(form);
    }
  }, [form, countPresenceHour, refreshData]);

  useEffect(() => {
    if (resultCountPresenceHour !== undefined) {
      setResult(resultCountPresenceHour.data);
    }
  }, [resultCountPresenceHour]);

  const employeeOptions =
    employeeData?.data?.map((employee: Employee) => ({
      value: employee.pkid,
      label: employee.fullname,
    })) || [];

  const handleSelectChange = (
    value: Option | null,
    field: keyof CountHourPresenceWhiteInputProperty,
  ) => {
    setForm({ ...form, [field]: value?.value });
  };

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const refetchCount = () => countPresenceHour(form);

  const refresh = () => {
    refetchRefreshData();
  };

  return (
    <>
      {isPending && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div role='status'>
            <svg
              aria-hidden='true'
              className='h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
      <div className='mx-auto p-6'>
        {isFetchingRefresh && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div role='status'>
              <svg
                aria-hidden='true'
                className='h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        )}
        <h2 className='mb-4 text-2xl font-bold'>
          Presensi Karyawan Kerah Biru (Operasional)
        </h2>
        <div className='flex w-full space-x-4'>
          <div className='mb-4 w-[33.33%]'>
            <label className='mb-1 block'>Karyawan</label>
            <Select
              value={
                form.employee_id
                  ? {
                      value: form.employee_id ?? '',
                      label:
                        employeeData?.data.find(
                          (item: { pkid: number }) =>
                            item?.pkid === form.employee_id,
                        )?.fullname ?? '',
                    }
                  : null
              }
              placeholder='Pilih karyawan'
              onChange={selectedOption =>
                handleSelectChange(selectedOption, 'employee_id')
              }
              options={employeeOptions}
              isLoading={isFetching}
              className='w-full'
            />
          </div>
          <div className='mb-4 w-[33.33%]'>
            <label className='mb-1 block'>Bulan</label>
            <Select
              value={
                form.month
                  ? {
                      value: form.month ?? '',
                      label:
                        months?.find(
                          (item: { value: number }) =>
                            item?.value === form.month,
                        )?.label ?? '',
                    }
                  : null
              }
              onChange={selectedOption =>
                handleSelectChange(selectedOption, 'month')
              }
              options={months}
              className='w-full'
            />
          </div>
          <div className='mb-4 w-[33.33%]'>
            <label className='mb-1 block'>Tahun</label>
            <Select
              value={
                form.year
                  ? {
                      value: form.year ?? '',
                      label:
                        years?.find(
                          (item: { value: number }) =>
                            item?.value === form.year,
                        )?.label ?? '',
                    }
                  : null
              }
              onChange={selectedOption =>
                handleSelectChange(selectedOption, 'year')
              }
              options={years}
              className='w-full'
            />
          </div>
        </div>
        <div>
          <button className='btn btn-info mb-4' onClick={refresh}>
            Refresh
          </button>
        </div>
        <div className='mb-5 rounded bg-white p-4 shadow-lg'>
          <label className='mb-2.5 block text-lg font-bold'>
            Rekap Total Presensi Per Bulan
          </label>
          <div className='space-y-1'>
            <div>Jumlah Jam Kerja: {result.bukpotOutput.work_hour}</div>
            <div>Jumlah Jam Penalti: {result.bukpotOutput.penalty_hour}</div>
          </div>
        </div>
        <ModalPresenceBlue
          modal={modalForm}
          pkid={pkid}
          setModal={handleSetModal}
          refetch={refetchCount}
        />
        <div className='mt-6 grid grid-cols-2 gap-4'>
          {result.bukpotOutput.allPresence.map(
            (item: PresenceBlueProperty, index: number) => (
              <div
                key={index}
                className='flex-col rounded bg-white p-4 shadow-lg'
              >
                <label className='block text-lg font-bold'>
                  Presensi Ke-{index + 1}
                </label>
                <div className='space-y-1'>
                  <div>Status: {item?.presence}</div>
                  <div>
                    Actual Check In:
                    {item?.actual_check_in
                      ? ' ' +
                        new Date(item?.actual_check_in).toLocaleTimeString() +
                        ' ' +
                        new Date(item?.actual_check_in).toDateString()
                      : ''}
                  </div>
                  <div>
                    Actual Check Out:
                    {item?.actual_check_out
                      ? ' ' +
                        new Date(item?.actual_check_out).toLocaleTimeString() +
                        ' ' +
                        new Date(item?.actual_check_out).toDateString()
                      : ''}
                  </div>
                  <div>
                    Scheduled Check In:
                    {item?.check_in
                      ? ' ' +
                        new Date(item?.check_in).toLocaleTimeString() +
                        ' ' +
                        new Date(item?.check_in).toDateString()
                      : ''}
                  </div>
                  <div>
                    Scheduled Check Out:
                    {item?.check_out
                      ? ' ' +
                        new Date(item?.check_out).toLocaleTimeString() +
                        ' ' +
                        new Date(item?.check_out).toDateString()
                      : ''}
                  </div>

                  <div>Deskripsi Event: {item?.event_description}</div>
                </div>
                <div className='mb-2 mt-2 flex w-full justify-center'>
                  {employeeData?.headers['can_update'] === 'true' &&
                  (!item?.actual_check_in ||
                    !item?.actual_check_out ||
                    item?.presence === 'Alfa') &&
                  item?.presence !== 'Izin' ? (
                    <button
                      className='btn btn-info'
                      onClick={() => {
                        dispatch(setModalForm(true));
                        dispatch(setPkid(item?.pkid || 0));
                      }}
                    >
                      Lakukan Presensi
                    </button>
                  ) : (
                    <button
                      className='btn btn-success'
                      onClick={() => {
                        dispatch(setModalForm(true));
                        dispatch(setPkid(item?.pkid || 0));
                      }}
                    >
                      Ubah Presensi
                    </button>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default PresenceBlueInfo;
