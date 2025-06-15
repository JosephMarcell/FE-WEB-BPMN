import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { useGetAllConfiguration } from '@/app/api/hooks/hrm/configuration/useGetAllConfiguration';
import { useUpdateConfiguration } from '@/app/api/hooks/hrm/configuration/useUpdateConfiguration';
import { useCreateOvertime } from '@/app/api/hooks/hrm/overtime/useCreateOvertime';
import { useDeleteOvertime } from '@/app/api/hooks/hrm/overtime/useDeleteOvertime';
import { useGetOvertimeByTenantId } from '@/app/api/hooks/hrm/overtime/useGetOvertimeByTenantId';
import { useUpdateOvertime } from '@/app/api/hooks/hrm/overtime/useUpdateOvertime';
import { getTokenData } from '@/helpers/utils/common/token';
import { OvertimeProperty } from '@/helpers/utils/hrm/overtime';

interface Option {
  value: string;
  label: string;
}

interface WhitePenaltyConfig {
  nyalakanPemberianPenalti: Option;
  nyalakanPemberianTunjanganPPh: Option;
  toleransiKeterlambatanJam: number;
  toleransiKeterlambatanMenit: number;
  jumlahPenaltiPerJam: number;
  jenisPenalti: Option;
  waktuMulaiKerjaJam?: number;
  waktuMulaiKerjaMenit?: number;
  durasiKerjaJam?: number;
  durasiKerjaMenit?: number;
  jumlahHariKerja?: number;
}

interface BluePenaltyConfig {
  nyalakanPemberianPenalti: Option;
  toleransiKeterlambatanJam: number;
  toleransiKeterlambatanMenit: number;
  jumlahPenaltiPerJam: number;
  jenisPenalti: Option;
  waktuMulaiKerjaJam?: number;
  waktuMulaiKerjaMenit?: number;
  durasiKerjaJam?: number;
  durasiKerjaMenit?: number;
  jumlahHariKerja?: number;
}

interface OvertimeConfig {
  pkid?: number;
  jamPertama: Option;
  jumlahBonus: number;
  satuanBonus: Option;
}

const optionsYaTidak: Option[] = [
  { value: 'Ya', label: 'Ya' },
  { value: 'Tidak', label: 'Tidak' },
];

const optionsJenisPenalti: Option[] = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'nominal', label: 'Nominal' },
];

const optionsJamPertama: Option[] = Array.from({ length: 30 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
})).concat({ value: '2147483647', label: 'MAX' });

const optionsSatuanBonus: Option[] = [
  { value: 'percentage', label: 'Persentase' },
  { value: 'nominal', label: 'Nominal' },
];

const OvertimePenaltyConfigurationForm: React.FC = () => {
  const { tenant_id, user_id } = getTokenData();
  const {
    data: configData,
    error: configError,
    refetch: refetchConfig,
  } = useGetAllConfiguration();
  const updateConfigMutation = useUpdateConfiguration();
  const {
    data: overtimeData,
    error: overtimeError,
    refetch: refetchOvertime,
  } = useGetOvertimeByTenantId(parseInt(tenant_id ? tenant_id : '0'));

  const createOvertimeMutation = useCreateOvertime();
  const updateOvertimeMutation = useUpdateOvertime();
  const deleteOvertimeMutation = useDeleteOvertime();

  const [configBiru, setConfigBiru] = useState<BluePenaltyConfig | null>(null);
  const [configPutih, setConfigPutih] = useState<WhitePenaltyConfig | null>(
    null,
  );

  const [lemburHariKerjaConfigs, setLemburHariKerjaConfigs] = useState<
    OvertimeConfig[]
  >([]);
  const [lemburHariLiburConfigs, setLemburHariLiburConfigs] = useState<
    OvertimeConfig[]
  >([]);
  const [lemburHariLiburNasionalConfigs, setLemburHariLiburNasionalConfigs] =
    useState<OvertimeConfig[]>([]);

  useEffect(() => {
    if (configData && typeof configData === 'object') {
      setConfigBiru({
        nyalakanPemberianPenalti: configData.blue_is_penalty_given
          ? optionsYaTidak[0]
          : optionsYaTidak[1],
        toleransiKeterlambatanJam: configData.blue_late_time_tolerance
          ? parseInt(configData.blue_late_time_tolerance.split(':')[0])
          : 0,
        toleransiKeterlambatanMenit: configData.blue_late_time_tolerance
          ? parseInt(configData.blue_late_time_tolerance.split(':')[1])
          : 0,
        jumlahPenaltiPerJam: configData.blue_late_salary_penalty_ph,
        jenisPenalti:
          optionsJenisPenalti.find(
            option =>
              configData.blue_late_salary_penalty_type &&
              option.value.toLowerCase() ===
                configData.blue_late_salary_penalty_type.toLowerCase(),
          ) || optionsJenisPenalti[0],
      });

      setConfigPutih({
        nyalakanPemberianPenalti: configData.white_is_penalty_given
          ? optionsYaTidak[0]
          : optionsYaTidak[1],
        nyalakanPemberianTunjanganPPh: configData.white_is_tunjangan_pph
          ? optionsYaTidak[0]
          : optionsYaTidak[1],
        toleransiKeterlambatanJam: configData.white_late_time_tolerance
          ? parseInt(configData.white_late_time_tolerance.split(':')[0])
          : 0,
        toleransiKeterlambatanMenit: configData.white_late_time_tolerance
          ? parseInt(configData.white_late_time_tolerance.split(':')[1])
          : 0,
        jumlahPenaltiPerJam: configData.white_late_salary_penalty_ph,
        jenisPenalti:
          optionsJenisPenalti.find(
            option =>
              configData.white_late_salary_penalty_type &&
              option.value.toLowerCase() ===
                configData.white_late_salary_penalty_type.toLowerCase(),
          ) || optionsJenisPenalti[0],
        waktuMulaiKerjaJam: configData.white_start_time
          ? parseInt(configData.white_start_time.split(':')[0])
          : 7,
        waktuMulaiKerjaMenit: configData.white_start_time
          ? parseInt(configData.white_start_time.split(':')[1])
          : 0,
        durasiKerjaJam: configData.white_work_duration
          ? parseInt(configData.white_work_duration.split(':')[0])
          : 8,
        durasiKerjaMenit: configData.white_work_duration
          ? parseInt(configData.white_work_duration.split(':')[1])
          : 0,
        jumlahHariKerja: configData.white_working_days_per_week,
      });
    }
  }, [configData]);

  useEffect(() => {
    if (Array.isArray(overtimeData)) {
      const hariKerja = overtimeData
        .filter((item: OvertimeProperty) => item.type === 'Hari kerja')
        .map((item: OvertimeProperty) => ({
          pkid: item.pkid ?? undefined,
          jamPertama: {
            value: item.jam_pertama?.toString() ?? '0',
            label:
              item.jam_pertama?.toString() === '2147483647'
                ? 'MAX'
                : item.jam_pertama?.toString() ?? '0',
          },
          jumlahBonus: item.overtime_rate_ph ?? 0,
          satuanBonus: {
            value: item.overtime_rate_type.toLowerCase(),
            label: item.overtime_rate_type,
          },
        }));
      setLemburHariKerjaConfigs(hariKerja);

      const hariLibur = overtimeData
        .filter((item: OvertimeProperty) => item.type === 'Hari libur')
        .map((item: OvertimeProperty) => ({
          pkid: item.pkid ?? undefined,
          jamPertama: {
            value: item.jam_pertama?.toString() ?? '0',
            label:
              item.jam_pertama?.toString() === '2147483647'
                ? 'MAX'
                : item.jam_pertama?.toString() ?? '0',
          },
          jumlahBonus: item.overtime_rate_ph ?? 0,
          satuanBonus: {
            value: item.overtime_rate_type.toLowerCase(),
            label: item.overtime_rate_type,
          },
        }));
      setLemburHariLiburConfigs(hariLibur);

      const hariLiburNasional = overtimeData
        .filter((item: OvertimeProperty) => item.type === 'Hari libur nasional')
        .map((item: OvertimeProperty) => ({
          pkid: item.pkid ?? undefined,
          jamPertama: {
            value: item.jam_pertama?.toString() ?? '0',
            label:
              item.jam_pertama?.toString() === '2147483647'
                ? 'MAX'
                : item.jam_pertama?.toString() ?? '0',
          },
          jumlahBonus: item.overtime_rate_ph ?? 0,
          satuanBonus: {
            value: item.overtime_rate_type.toLowerCase(),
            label: item.overtime_rate_type,
          },
        }));
      setLemburHariLiburNasionalConfigs(hariLiburNasional);
    }
  }, [overtimeData]);

  const handleChangeBiru = (
    field: keyof BluePenaltyConfig,
    value: string | number | SingleValue<Option>,
  ) => {
    let newValue = value;
    if (typeof value === 'number') {
      if (
        field === 'toleransiKeterlambatanJam' ||
        field === 'waktuMulaiKerjaJam' ||
        field === 'durasiKerjaJam'
      ) {
        newValue = Math.max(0, Math.min(23, value));
      } else if (
        field === 'toleransiKeterlambatanMenit' ||
        field === 'waktuMulaiKerjaMenit' ||
        field === 'durasiKerjaMenit'
      ) {
        newValue = Math.max(0, Math.min(59, value));
      } else if (field === 'jumlahPenaltiPerJam') {
        if (configBiru?.jenisPenalti.value === 'percentage') {
          newValue = Math.max(1, Math.min(100, value));
        } else {
          newValue = Math.max(0, value);
        }
      } else if (field === 'jumlahHariKerja') {
        newValue = Math.max(0, value);
      }
    }
    if (configBiru) {
      setConfigBiru({ ...configBiru, [field]: newValue } as BluePenaltyConfig);
    }
  };

  const handleChangePutih = (
    field: keyof WhitePenaltyConfig,
    value: string | number | SingleValue<Option>,
  ) => {
    let newValue = value;
    if (typeof value === 'number') {
      if (
        field === 'toleransiKeterlambatanJam' ||
        field === 'waktuMulaiKerjaJam' ||
        field === 'durasiKerjaJam'
      ) {
        newValue = Math.max(0, Math.min(23, value));
      } else if (
        field === 'toleransiKeterlambatanMenit' ||
        field === 'waktuMulaiKerjaMenit' ||
        field === 'durasiKerjaMenit'
      ) {
        newValue = Math.max(0, Math.min(59, value));
      } else if (field === 'jumlahPenaltiPerJam') {
        if (configPutih?.jenisPenalti.value === 'percentage') {
          newValue = Math.max(1, Math.min(100, value));
        } else {
          newValue = Math.max(0, value);
        }
      } else if (field === 'jumlahHariKerja') {
        newValue = Math.max(0, value);
      }
    }
    if (configPutih) {
      setConfigPutih({
        ...configPutih,
        [field]: newValue,
      } as WhitePenaltyConfig);
    }
  };

  const handleLemburChange = (
    setConfigs: React.Dispatch<React.SetStateAction<OvertimeConfig[]>>,
    index: number,
    field: keyof OvertimeConfig,
    value: string | number | SingleValue<Option>,
  ) => {
    setConfigs(prevConfigs => {
      const newConfigs = [...prevConfigs];
      let newValue = value;
      if (typeof value === 'number' && field === 'jumlahBonus') {
        newValue =
          newConfigs[index].satuanBonus.value === 'percentage'
            ? Math.max(0, Math.min(100, value))
            : Math.max(0, value);
      }
      newConfigs[index] = {
        ...newConfigs[index],
        [field]: newValue,
      } as OvertimeConfig;
      return newConfigs;
    });
  };

  const addLemburConfig = (
    setConfigs: React.Dispatch<React.SetStateAction<OvertimeConfig[]>>,
  ) => {
    setConfigs(prevConfigs => [
      ...prevConfigs,
      {
        jamPertama: optionsJamPertama[0],
        jumlahBonus: 0,
        satuanBonus: optionsSatuanBonus[0],
      },
    ]);
  };

  const removeLemburConfig = async (
    setConfigs: React.Dispatch<React.SetStateAction<OvertimeConfig[]>>,
    index: number,
    pkid?: number,
  ) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then(result => {
      if (result.isConfirmed) {
        (async () => {
          if (pkid) {
            try {
              await deleteOvertimeMutation.mutateAsync(pkid);
              setConfigs(prevConfigs => {
                const newConfigs = [...prevConfigs];
                newConfigs.splice(index, 1);
                return newConfigs;
              });
              refetchOvertime();
              Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Data has been deleted successfully',
              });
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error deleting overtime',
              });
            }
          } else {
            setConfigs(prevConfigs => {
              const newConfigs = [...prevConfigs];
              newConfigs.splice(index, 1);
              return newConfigs;
            });
          }
        })();
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsedTenantId = tenant_id ? parseInt(tenant_id) : 0;
    const parsedUserId = user_id ? parseInt(user_id) : 0;

    if (parsedTenantId === 0) {
      // console.error('Tenant ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tenant ID is undefined',
      });
      return;
    }

    if (!configPutih || !configBiru) {
      // console.error('Configurations are not fully loaded');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Configurations are not fully loaded',
      });
      return;
    }

    const existingConfig = configData || {};

    const updatedConfig = {
      ...existingConfig,
      updated_by: parsedUserId,
      updated_date: new Date().toISOString(),
      updated_host: window.location.hostname,
      white_is_penalty_given:
        configPutih.nyalakanPemberianPenalti.value === 'Ya',
      white_is_tunjangan_pph:
        configPutih.nyalakanPemberianTunjanganPPh.value === 'Ya',
      white_late_time_tolerance: `${configPutih.toleransiKeterlambatanJam}:${configPutih.toleransiKeterlambatanMenit}:00`,
      white_late_salary_penalty_ph: configPutih.jumlahPenaltiPerJam,
      white_late_salary_penalty_type: configPutih.jenisPenalti.value,
      white_start_time: `${configPutih.waktuMulaiKerjaJam}:${configPutih.waktuMulaiKerjaMenit}:00`,
      white_work_duration: `${configPutih.durasiKerjaJam ?? 0}:${
        configPutih.durasiKerjaMenit ?? 0
      }:00`,
      white_working_days_per_week: configPutih.jumlahHariKerja,
      blue_is_penalty_given: configBiru.nyalakanPemberianPenalti.value === 'Ya',
      blue_late_time_tolerance: `${configBiru.toleransiKeterlambatanJam}:${configBiru.toleransiKeterlambatanMenit}:00`,
      blue_late_salary_penalty_ph: configBiru.jumlahPenaltiPerJam,
      blue_late_salary_penalty_type: configBiru.jenisPenalti.value,
    };

    const allConfigs = [
      ...lemburHariKerjaConfigs.map(config => ({
        ...config,
        type: 'Hari kerja',
      })),
      ...lemburHariLiburConfigs.map(config => ({
        ...config,
        type: 'Hari libur',
      })),
      ...lemburHariLiburNasionalConfigs.map(config => ({
        ...config,
        type: 'Hari libur nasional',
      })),
    ];

    const overtimePromises = allConfigs.map(async config => {
      const data: OvertimeProperty = {
        pkid: config.pkid || 0, // Provide default values for required properties
        type: config.type,
        jam_pertama: parseInt(config.jamPertama.value),
        overtime_rate_ph: config.jumlahBonus,
        overtime_rate_type: config.satuanBonus.value,
        tenant: parsedTenantId,
        created_by: parsedUserId,
        created_date: new Date().toISOString(),
        created_host: window.location.hostname,
        updated_by: config.pkid ? parsedUserId : null, // Handle optional properties
        updated_date: config.pkid ? new Date().toISOString() : null,
        updated_host: config.pkid ? window.location.hostname : null,
        is_deleted: false,
        deleted_by: null,
        deleted_date: null,
        deleted_host: null,
      };

      if (config.pkid) {
        return updateOvertimeMutation.mutateAsync({
          pkid: config.pkid,
          data: {
            ...data,
            updated_by: parsedUserId,
            updated_date: new Date().toISOString(),
            updated_host: window.location.hostname,
          },
        });
      } else {
        return createOvertimeMutation.mutateAsync(data);
      }
    });

    try {
      await Promise.all([
        updateConfigMutation.mutateAsync({
          pkid: parsedTenantId,
          data: updatedConfig,
        }),
        ...overtimePromises,
      ]);
      refetchConfig();
      refetchOvertime();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Configuration updated successfully',
      });
    } catch (error) {
      // console.error('Error in handleSubmit:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating configuration',
      });
    }
  };

  if (!configBiru || !configPutih) {
    return <div>Loading...</div>;
  }

  return (
    <form className='space-y-10 p-5' onSubmit={handleSubmit}>
      {configError && (
        <div className='error-message'>{configError.message}</div>
      )}
      {overtimeError && (
        <div className='error-message'>{overtimeError.message}</div>
      )}

      <div className='rounded-lg border p-5 shadow-md'>
        <h3 className='mb-5 text-xl font-bold'>Konfigurasi Kerah Biru</h3>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Nyalakan Pemberian Penalti Telat & Alfa
          </label>
          <Select
            value={configBiru.nyalakanPemberianPenalti}
            onChange={selectedOption =>
              handleChangeBiru(
                'nyalakanPemberianPenalti',
                selectedOption as SingleValue<Option>,
              )
            }
            options={optionsYaTidak}
            className='mt-1'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Toleransi Keterlambatan
          </label>
          <div className='flex space-x-2'>
            <input
              type='number'
              value={configBiru.toleransiKeterlambatanJam ?? 0}
              onChange={e =>
                handleChangeBiru(
                  'toleransiKeterlambatanJam',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='23'
              className='w-16 rounded border p-2'
            />{' '}
            Jam
            <input
              type='number'
              value={configBiru.toleransiKeterlambatanMenit ?? 0}
              onChange={e =>
                handleChangeBiru(
                  'toleransiKeterlambatanMenit',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='59'
              className='w-16 rounded border p-2'
            />{' '}
            Menit
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Jumlah Penalti Per Jam
          </label>
          <input
            type='number'
            value={configBiru.jumlahPenaltiPerJam}
            onChange={e =>
              handleChangeBiru('jumlahPenaltiPerJam', parseInt(e.target.value))
            }
            min='0'
            className='w-full rounded border p-2'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Jenis Penalti
          </label>
          <Select
            value={configBiru.jenisPenalti}
            onChange={selectedOption =>
              handleChangeBiru(
                'jenisPenalti',
                selectedOption as SingleValue<Option>,
              )
            }
            options={optionsJenisPenalti}
            className='mt-1'
          />
        </div>
      </div>

      <div className='rounded-lg border p-5 shadow-md'>
        <h3 className='mb-5 text-xl font-bold'>Konfigurasi Kerah Putih</h3>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Nyalakan Pemberian Penalti Telat & Alfa
          </label>
          <Select
            value={configPutih.nyalakanPemberianPenalti}
            onChange={selectedOption =>
              handleChangePutih(
                'nyalakanPemberianPenalti',
                selectedOption as SingleValue<Option>,
              )
            }
            options={optionsYaTidak}
            className='mt-1'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Nyalakan Pemberian Tunjangan PPh (Metode Gross Up)
          </label>
          <Select
            value={configPutih.nyalakanPemberianTunjanganPPh}
            onChange={selectedOption =>
              handleChangePutih(
                'nyalakanPemberianTunjanganPPh',
                selectedOption as SingleValue<Option>,
              )
            }
            options={optionsYaTidak}
            className='mt-1'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Toleransi Keterlambatan
          </label>
          <div className='flex space-x-2'>
            <input
              type='number'
              value={configPutih.toleransiKeterlambatanJam ?? 0}
              onChange={e =>
                handleChangePutih(
                  'toleransiKeterlambatanJam',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='23'
              className='w-16 rounded border p-2'
            />{' '}
            Jam
            <input
              type='number'
              value={configPutih.toleransiKeterlambatanMenit ?? 0}
              onChange={e =>
                handleChangePutih(
                  'toleransiKeterlambatanMenit',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='59'
              className='w-16 rounded border p-2'
            />{' '}
            Menit
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Jumlah Penalti Per Jam
          </label>
          <input
            type='number'
            value={configPutih.jumlahPenaltiPerJam}
            onChange={e =>
              handleChangePutih('jumlahPenaltiPerJam', parseInt(e.target.value))
            }
            min='0'
            className='w-full rounded border p-2'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Jenis Penalti
          </label>
          <Select
            value={configPutih.jenisPenalti}
            onChange={selectedOption =>
              handleChangePutih(
                'jenisPenalti',
                selectedOption as SingleValue<Option>,
              )
            }
            options={optionsJenisPenalti}
            className='mt-1'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Waktu Mulai Kerja
          </label>
          <div className='flex space-x-2'>
            <input
              type='number'
              value={configPutih.waktuMulaiKerjaJam ?? 0}
              onChange={e =>
                handleChangePutih(
                  'waktuMulaiKerjaJam',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='23'
              className='w-16 rounded border p-2'
            />{' '}
            Jam
            <input
              type='number'
              value={configPutih.waktuMulaiKerjaMenit ?? 0}
              onChange={e =>
                handleChangePutih(
                  'waktuMulaiKerjaMenit',
                  parseInt(e.target.value),
                )
              }
              min='0'
              max='59'
              className='w-16 rounded border p-2'
            />{' '}
            Menit
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Durasi Kerja
          </label>
          <div className='flex space-x-2'>
            <input
              type='number'
              value={configPutih.durasiKerjaJam ?? 0}
              onChange={e =>
                handleChangePutih('durasiKerjaJam', parseInt(e.target.value))
              }
              min='0'
              max='23'
              className='w-16 rounded border p-2'
            />{' '}
            Jam
            <input
              type='number'
              value={configPutih.durasiKerjaMenit ?? 0}
              onChange={e =>
                handleChangePutih('durasiKerjaMenit', parseInt(e.target.value))
              }
              min='0'
              max='59'
              className='w-16 rounded border p-2'
            />{' '}
            Menit
          </div>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Jumlah Hari Kerja
          </label>
          <input
            type='number'
            value={configPutih.jumlahHariKerja ?? 0}
            onChange={e =>
              handleChangePutih('jumlahHariKerja', parseInt(e.target.value))
            }
            min='1'
            max='7'
            className='w-full rounded border p-2'
          />
        </div>
      </div>

      <div className='rounded-lg border p-5 shadow-md'>
        <h3 className='mb-5 text-xl font-bold'>Konfigurasi Lembur</h3>

        <h4 className='mb-3 text-lg font-semibold'>Lembur Hari Kerja</h4>
        {lemburHariKerjaConfigs.map((config, index) => (
          <div key={index} className='mb-4 flex items-center space-x-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jam Pertama
              </label>
              <Select
                value={config.jamPertama}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariKerjaConfigs,
                    index,
                    'jamPertama',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsJamPertama}
                className='mt-1'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jumlah Bonus
              </label>
              <input
                type='number'
                value={config.jumlahBonus}
                onChange={e =>
                  handleLemburChange(
                    setLemburHariKerjaConfigs,
                    index,
                    'jumlahBonus',
                    parseFloat(e.target.value),
                  )
                }
                min={config.satuanBonus.value === 'percentage' ? 0 : undefined}
                max={
                  config.satuanBonus.value === 'percentage' ? 100 : undefined
                }
                className='w-full rounded border p-2'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Satuan Bonus
              </label>
              <Select
                value={config.satuanBonus}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariKerjaConfigs,
                    index,
                    'satuanBonus',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsSatuanBonus}
                className='mt-1'
              />
            </div>
            <div>
              <button
                type='button'
                onClick={() =>
                  removeLemburConfig(
                    setLemburHariKerjaConfigs,
                    index,
                    config.pkid,
                  )
                }
                className='text-red-500 hover:underline'
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        <button
          type='button'
          onClick={() => addLemburConfig(setLemburHariKerjaConfigs)}
          className='text-blue-500 hover:underline'
        >
          Tambah Data Jam Lembur
        </button>

        <h4 className='mb-3 mt-8 text-lg font-semibold'>Lembur Hari Libur</h4>
        {lemburHariLiburConfigs.map((config, index) => (
          <div key={index} className='mb-4 flex items-center space-x-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jam Pertama
              </label>
              <Select
                value={config.jamPertama}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariLiburConfigs,
                    index,
                    'jamPertama',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsJamPertama}
                className='mt-1'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jumlah Bonus
              </label>
              <input
                type='number'
                value={config.jumlahBonus}
                onChange={e =>
                  handleLemburChange(
                    setLemburHariLiburConfigs,
                    index,
                    'jumlahBonus',
                    parseFloat(e.target.value),
                  )
                }
                min={config.satuanBonus.value === 'percentage' ? 0 : undefined}
                max={
                  config.satuanBonus.value === 'percentage' ? 100 : undefined
                }
                className='w-full rounded border p-2'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Satuan Bonus
              </label>
              <Select
                value={config.satuanBonus}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariLiburConfigs,
                    index,
                    'satuanBonus',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsSatuanBonus}
                className='mt-1'
              />
            </div>
            <div>
              <button
                type='button'
                onClick={() =>
                  removeLemburConfig(
                    setLemburHariLiburConfigs,
                    index,
                    config.pkid,
                  )
                }
                className='text-red-500 hover:underline'
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        <button
          type='button'
          onClick={() => addLemburConfig(setLemburHariLiburConfigs)}
          className='text-blue-500 hover:underline'
        >
          Tambah Data Jam Lembur
        </button>

        <h4 className='mb-3 mt-8 text-lg font-semibold'>
          Lembur Hari Libur Nasional
        </h4>
        {lemburHariLiburNasionalConfigs.map((config, index) => (
          <div key={index} className='mb-4 flex items-center space-x-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jam Pertama
              </label>
              <Select
                value={config.jamPertama}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariLiburNasionalConfigs,
                    index,
                    'jamPertama',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsJamPertama}
                className='mt-1'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Jumlah Bonus
              </label>
              <input
                type='number'
                value={config.jumlahBonus}
                onChange={e =>
                  handleLemburChange(
                    setLemburHariLiburNasionalConfigs,
                    index,
                    'jumlahBonus',
                    parseFloat(e.target.value),
                  )
                }
                min={config.satuanBonus.value === 'percentage' ? 0 : undefined}
                max={
                  config.satuanBonus.value === 'percentage' ? 100 : undefined
                }
                className='w-full rounded border p-2'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Satuan Bonus
              </label>
              <Select
                value={config.satuanBonus}
                onChange={selectedOption =>
                  handleLemburChange(
                    setLemburHariLiburNasionalConfigs,
                    index,
                    'satuanBonus',
                    selectedOption as SingleValue<Option>,
                  )
                }
                options={optionsSatuanBonus}
                className='mt-1'
              />
            </div>
            <div>
              <button
                type='button'
                onClick={() =>
                  removeLemburConfig(
                    setLemburHariLiburNasionalConfigs,
                    index,
                    config.pkid,
                  )
                }
                className='text-red-500 hover:underline'
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        <button
          type='button'
          onClick={() => addLemburConfig(setLemburHariLiburNasionalConfigs)}
          className='text-blue-500 hover:underline'
        >
          Tambah Data Jam Lembur
        </button>
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          className='rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default OvertimePenaltyConfigurationForm;
