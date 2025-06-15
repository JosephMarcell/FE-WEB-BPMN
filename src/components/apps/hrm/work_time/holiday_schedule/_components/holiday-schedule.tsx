import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import Swal from 'sweetalert2';

import { useCreateHolidaySchedule } from '@/app/api/hooks/hrm/holiday_schedule/useCreateHolidaySchedule';
import { useDeleteHolidaySchedule } from '@/app/api/hooks/hrm/holiday_schedule/useDeleteHolidaySchedule';
import { useGetAllHolidaySchedule } from '@/app/api/hooks/hrm/holiday_schedule/useGetAllHolidaySchedule';

const today = new Date();

const HolidaySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [holidayStatus, setHolidayStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [holidayData, setHolidayData] = useState<{ [key: string]: number }>({});
  const { data: holidays, refetch } = useGetAllHolidaySchedule();
  const createHolidayMutation = useCreateHolidaySchedule();
  const deleteHolidayMutation = useDeleteHolidaySchedule();

  useEffect(() => {
    if (holidays) {
      const initialStatus: { [key: string]: boolean } = {};
      const initialData: { [key: string]: number } = {};
      holidays?.data.forEach((holiday: { date: string; pkid: number }) => {
        const formattedDate = holiday.date.split('T')[0];
        initialStatus[formattedDate] = true;
        initialData[formattedDate] = holiday.pkid;
      });
      setHolidayStatus(initialStatus);
      setHolidayData(initialData);
    }
  }, [holidays]);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDate(dates[0]);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleHolidayStatus = async () => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      const isLibur = !holidayStatus[formattedDate];

      const result = await Swal.fire({
        title: `Are you sure you want to ${
          isLibur ? 'set' : 'unset'
        } this date as "libur"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result.isConfirmed) {
        setHolidayStatus(prevStatus => ({
          ...prevStatus,
          [formattedDate]: isLibur,
        }));

        if (isLibur) {
          try {
            await createHolidayMutation.mutateAsync({
              date: formattedDate,
            });
            refetch();
            Swal.fire('Success', 'Date set as "libur" successfully', 'success');
          } catch (error) {
            Swal.fire(
              'Error',
              'There was an error setting the date as "libur"',
              'error',
            );
          }
        } else {
          const pkid = holidayData[formattedDate];
          if (pkid) {
            try {
              await deleteHolidayMutation.mutateAsync(pkid);
              refetch();
              Swal.fire(
                'Success',
                'Date unset from "libur" successfully',
                'success',
              );
            } catch (error) {
              Swal.fire(
                'Error',
                'There was an error unsetting the date from "libur"',
                'error',
              );
            }
          } else {
            Swal.fire(
              'Error',
              'No matching holiday entry found to unset',
              'error',
            );
          }
        }
      }
    }
  };

  const isDatePassed = (date: Date) => {
    return date < today;
  };

  const renderHolidayButton = () => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      if (!isDatePassed(selectedDate)) {
        return (
          holidays?.headers['can_create'] === 'true' && (
            <button
              onClick={toggleHolidayStatus}
              className='mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700'
            >
              {holidayStatus[formattedDate]
                ? 'Jadikan Tidak Libur'
                : 'Jadikan Hari Libur'}
            </button>
          )
        );
      }
    }
    return null;
  };

  const renderHolidayStatus = () => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      return (
        <div className='mt-2 text-lg font-semibold'>
          Status: {holidayStatus[formattedDate] ? 'LIBUR' : 'TIDAK LIBUR'}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className='mb-4 text-2xl font-bold'>Kalender Hari Libur</h2>
      <div className='flex w-full flex-row items-start space-x-8'>
        <Flatpickr
          options={{ dateFormat: 'Y-m-d' }}
          value={selectedDate}
          onChange={handleDateChange}
          className='w-[540px] rounded border px-4 py-2'
          placeholder='Pilih tanggal...'
        />
        {selectedDate && (
          <div className='flex w-full flex-col items-start'>
            <h3 className='text-xl font-semibold'>
              {selectedDate.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h3>
            {renderHolidayButton()}
            {renderHolidayStatus()}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaySchedule;
