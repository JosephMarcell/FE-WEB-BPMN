import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { writeCurrency } from '@/lib/money';
import { Option } from '@/lib/view';

import IconTrashLines from '@/components/icon/icon-trash-lines';

import { useGetAllAllowanceName } from '@/app/api/hooks/hrm/allowance/useGetAllAllowanceName';
import { useGetEmployeeByPkid } from '@/app/api/hooks/hrm/employee/useGetEmployeeByPkid';
import { useGetAllReductionName } from '@/app/api/hooks/hrm/reduction_name/useGetAllReductionName';
import { useCountSalarySlipWhite } from '@/app/api/hooks/hrm/salary_slip/useCountSalarySlipWhite';
import {
  employeeInitialState,
  EmployeeProperty,
} from '@/helpers/utils/hrm/employee';
import {
  allowanceInitialState,
  AllowanceProperty,
  CountSalarySlipWhiteOutput,
  countSalarySlipWhiteOutputInitialState,
  reductionInitialState,
  ReductionProperty,
} from '@/helpers/utils/hrm/salary_slip';

interface DataProperty {
  gaji_pokok: number;
  penalti: number;
  employee_id: number;
  month: number;
  year: number;
}

const initialDataProperty: DataProperty = {
  gaji_pokok: 0,
  penalti: 0,
  employee_id: 0,
  month: 0,
  year: 0,
};

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const PayrollCalculatorResult = () => {
  const [data, setData] = useState<DataProperty>(initialDataProperty);

  const { data: employeeData } = useGetEmployeeByPkid(data.employee_id);
  const { data: allowanceList } = useGetAllAllowanceName();
  const { data: reductionList } = useGetAllReductionName();
  const {
    mutateAsync: countSalarySlipWhite,
    data: calculationResult,
    isPending,
  } = useCountSalarySlipWhite();

  const [result, setResult] = useState<CountSalarySlipWhiteOutput>(
    countSalarySlipWhiteOutputInitialState,
  );
  const [employee, setEmployee] =
    useState<EmployeeProperty>(employeeInitialState);
  const [newAllowanceName, setNewAllowanceName] = useState<Option>();
  const [newAllowanceNominal, setNewAllowanceNominal] = useState<number>(0);
  const [allowances, setAllowances] = useState<AllowanceProperty[]>([]);

  const [newReductionName, setNewReductionName] = useState<Option>();
  const [newReductionNominal, setNewReductionNominal] = useState<number>(0);
  const [reductions, setReductions] = useState<ReductionProperty[]>([]);
  const [_, setIsPPhReturned] = useState<boolean>(false);

  const allowanceOptions =
    allowanceList?.map((allowance: { pkid: number; name: string }) => ({
      value: allowance.pkid,
      label: allowance.name,
    })) || [];

  const reductionOptions =
    reductionList?.data.map((reduction: { pkid: number; name: string }) => ({
      value: reduction.pkid,
      label: reduction.name,
    })) || [];

  useEffect(() => {
    const data = localStorage.getItem('calculate_payroll');
    const parsedData = data ? JSON.parse(data) : null;
    setData(parsedData);
  }, []);

  useEffect(() => {
    if (data.gaji_pokok !== 0) {
      countSalarySlipWhite({
        gaji_pokok: Number(data.gaji_pokok),
        penalti: Number(data.penalti),
        employee_id: data.employee_id,
        month: Number(data.month),
        year: Number(data.year),
        tunjangan_lain: 0,
        pengurangan_lain: 0,
        gaji_lembur: 0,
      });
    }
  }, [data, countSalarySlipWhite]);

  useEffect(() => {
    if (calculationResult !== undefined && result !== null) {
      setResult({
        ...calculationResult.data.countOutput,
      });
    }
  }, [calculationResult, result]);

  useEffect(() => {
    if (employeeData !== undefined) setEmployee(employeeData);
  }, [employeeData]);

  const renderByAmount = (
    title: string,
    count_amount: number,
    has_negative = false,
  ) => {
    return (
      <>
        {count_amount > 0 && (
          <div className='flex w-full justify-between'>
            <div>{title}</div>
            <div>
              {has_negative ? '- ' : ''}
              {handleWriteCurrency(count_amount)}
            </div>
          </div>
        )}
      </>
    );
  };

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handleSetAllowanceName = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setNewAllowanceName({
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
    }
  };

  const handleSetReductionName = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setNewReductionName({
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
    }
  };

  const handleAddNewAllowance = () => {
    if (newAllowanceName?.label && newAllowanceNominal !== 0) {
      const newAllowance = allowances;

      newAllowance.push({
        ...allowanceInitialState,
        amount: Number(newAllowanceNominal),
        AllowanceName: {
          pkid: Number(newAllowanceName?.value) || null,
          name: newAllowanceName?.label || null,
          type: null,
        },
      });

      const totalAllowance = newAllowance.reduce(
        (acc, item) => acc + item.amount,
        0,
      );
      const totalReduction = reductions.reduce(
        (acc, item) => acc + item.amount,
        0,
      );

      countSalarySlipWhite({
        gaji_pokok: Number(data.gaji_pokok),
        penalti: Number(data.penalti),
        employee_id: data.employee_id,
        month: Number(data.month),
        year: Number(data.year),
        tunjangan_lain: totalAllowance,
        pengurangan_lain: totalReduction,
        gaji_lembur: 0,
      });

      setAllowances(newAllowance);
      setNewAllowanceNominal(0);
    }
  };

  const handleAddNewReduction = () => {
    if (newReductionName?.label && newReductionNominal !== null) {
      if (
        Number(reductions.reduce((acc, item) => acc + item.amount, 0)) +
          Number(newReductionNominal) >
        Number(result.takeHomePay)
      ) {
        Swal.fire(
          'Error!',
          'Reduction can not be bigger than take home pay.',
          'error',
        );
      } else {
        const newReduction = reductions;

        newReduction.push({
          ...reductionInitialState,
          amount: Number(newReductionNominal),
          ReductionName: {
            pkid: Number(newReductionName?.value) || null,
            name: newReductionName?.label || null,
          },
        });

        const totalReduction = newReduction.reduce(
          (acc, item) => acc + item.amount,
          0,
        );
        const totalAllowance = allowances.reduce(
          (acc, item) => acc + item.amount,
          0,
        );

        countSalarySlipWhite({
          gaji_pokok: Number(data.gaji_pokok),
          penalti: Number(data.penalti),
          employee_id: data.employee_id,
          month: Number(data.month),
          year: Number(data.year),
          tunjangan_lain: totalAllowance,
          pengurangan_lain: totalReduction,
          gaji_lembur: 0,
        });

        setReductions(newReduction);
        setNewReductionNominal(0);
      }
    }
  };

  const handleDeleteAllowance = (index: number) => {
    const newAllowance = allowances?.filter((_, i) => i !== index);

    const totalAllowance = newAllowance.reduce(
      (acc, item) => acc + item.amount,
      0,
    );
    const totalReduction = reductions.reduce(
      (acc, item) => acc + item.amount,
      0,
    );

    countSalarySlipWhite({
      gaji_pokok: Number(data.gaji_pokok),
      penalti: Number(data.penalti),
      employee_id: data.employee_id,
      month: Number(data.month),
      year: Number(data.year),
      tunjangan_lain: totalAllowance,
      pengurangan_lain: totalReduction,
      gaji_lembur: 0,
    });

    if (newAllowance) {
      setAllowances(newAllowance);
    }
  };

  const handleDeleteReduction = (index: number) => {
    const newReduction = reductions?.filter((_, i) => i !== index);

    const totalReduction = newReduction.reduce(
      (acc, item) => acc + item.amount,
      0,
    );
    const totalAllowance = allowances.reduce(
      (acc, item) => acc + item.amount,
      0,
    );

    countSalarySlipWhite({
      gaji_pokok: Number(data.gaji_pokok),
      penalti: Number(data.penalti),
      employee_id: data.employee_id,
      month: Number(data.month),
      year: Number(data.year),
      tunjangan_lain: totalAllowance,
      pengurangan_lain: totalReduction,
      gaji_lembur: 0,
    });

    if (newReduction) {
      setReductions(newReduction);
    }
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
        <h2 className='mb-4 text-2xl font-bold'>Slip Gaji Kerah Putih</h2>
        <div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Profil Pegawai</h3>
            <div className='flex w-full justify-between'>
              <div>Nama</div>
              <div>{employee.fullname}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>NIP</div>
              <div>{employee.nip}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Jabatan</div>
              <div>{employee.Position.name}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Golongan</div>
              <div>{employee.Position.WhitePayroll?.nama_golongan}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Bulan</div>
              <div>{months[data.month]}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Tahun</div>
              <div>{data.year}</div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pendapatan Tetap</h3>
            <div className='flex w-full justify-between'>
              <div>Gaji Tetap</div>
              <div>{handleWriteCurrency(Number(data.gaji_pokok))}</div>
            </div>
            {renderByAmount(
              'Tunjangan Tetap - Jabatan',
              result.tunjangan_tetap_position || 0,
            )}
            {renderByAmount(
              'Tunjangan Tetap - Keluarga',
              result.tunjangan_tetap_ptkp || 0,
            )}
            {renderByAmount('Penalti', data.penalti || 0, true)}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>{handleWriteCurrency(result.penghasilanTetap || 0)}</div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pendapatan Tidak Tetap</h3>
            {allowances.map((item: AllowanceProperty, index) => (
              <div key={index} className='flex w-full justify-between'>
                <div className='flex space-x-2 align-middle'>
                  <div onClick={_ => handleDeleteAllowance(index)}>
                    <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                  </div>
                  <div>{item.AllowanceName?.name}</div>
                </div>
                <div>{handleWriteCurrency(item.amount)}</div>
              </div>
            ))}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {handleWriteCurrency(
                  allowances.reduce((acc, item) => acc + item.amount, 0),
                )}
              </div>
            </div>
            <div className='pt-3 font-bold'>Tambah Tunjangan Lain</div>
            <div className='flex space-x-2'>
              <div className='w-full'>
                <label className='block'>Jenis Pendapatan</label>
                <Select
                  options={allowanceOptions}
                  onChange={handleSetAllowanceName}
                  className='w-full'
                />
              </div>
              <div className='w-full'>
                <label className='block'>Nominal</label>
                <input
                  value={newAllowanceNominal}
                  onChange={e => setNewAllowanceNominal(Number(e.target.value))}
                  type='number'
                  className='h-10 w-full rounded-md border border-gray-300'
                />
              </div>
            </div>
            <div className='pt-2'>
              <button
                type='submit'
                className='btn btn-info'
                onClick={handleAddNewAllowance}
              >
                Tambah Tunjangan
              </button>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Ditanggung Perusahaan</h3>
            {renderByAmount('Tunjangan PPh', result.tunjangan_pph || 0)}
            {renderByAmount(
              'BPJS Kesehatan',
              result.benefit_bpjs_kesehatan || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JHT',
              result.benefit_bpjs_tk_jht || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JKK',
              result.benefit_bpjs_tk_jkk || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JKM',
              result.benefit_bpjs_tk_jkm || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JP',
              result.benefit_bpjs_tk_jp || 0,
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {handleWriteCurrency(
                  Number(result.tunjangan_pph) +
                    Number(result.benefit_bpjs_kesehatan) +
                    Number(result.benefit_bpjs_tk_jht) +
                    Number(result.benefit_bpjs_tk_jkk) +
                    Number(result.benefit_bpjs_tk_jkm) +
                    Number(result.benefit_bpjs_tk_jp),
                )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Total Pendapatan</div>
              <div>
                {handleWriteCurrency(
                  Number(result.penghasilanTetap) +
                    allowances.reduce((acc, item) => acc + item.amount, 0),
                )}
              </div>
            </div>
          </div>
          {Number(result.tunjangan_pph) > 0 ? (
            <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
              <div className='flex w-full justify-between font-bold'>
                <div>
                  Total Pendapatan & Ditanggung Perusahaan Sebelum Tunjangan PPh
                </div>
                <div>
                  {handleWriteCurrency(
                    Number(result.gaji_pokok) +
                      Number(result.tunjangan_tetap_ptkp) +
                      Number(result.tunjangan_tetap_position) -
                      allowances.reduce((acc, item) => acc + item.amount, 0) +
                      Number(result.benefit_bpjs_kesehatan) +
                      Number(result.benefit_bpjs_tk_jht) +
                      Number(result.benefit_bpjs_tk_jkk) +
                      Number(result.benefit_bpjs_tk_jkm) +
                      Number(result.benefit_bpjs_tk_jp),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Total Pendapatan & Ditanggung Perusahaan</div>
              <div>
                {handleWriteCurrency(
                  Number(result.gaji_pokok) +
                    Number(result.tunjangan_tetap_ptkp) +
                    Number(result.tunjangan_tetap_position) -
                    allowances.reduce((acc, item) => acc + item.amount, 0) +
                    Number(result.tunjangan_pph) +
                    Number(result.benefit_bpjs_kesehatan) +
                    Number(result.benefit_bpjs_tk_jht) +
                    Number(result.benefit_bpjs_tk_jkk) +
                    Number(result.benefit_bpjs_tk_jkm) +
                    Number(result.benefit_bpjs_tk_jp),
                )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan</h3>
            {renderByAmount(
              'Asuransi Pribadi',
              result.deduction_asuransi_pribadi || 0,
              true,
            )}
            {renderByAmount('Amal Pribadi', result.deduction_amal || 0, true)}
            {renderByAmount(
              'BPJS Kesehatan',
              result.deduction_bpjs_kesehatan || 0,
              true,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JHT',
              result.deduction_bpjs_tk_jht || 0,
              true,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JP',
              result.deduction_bpjs_tk_jp || 0,
              true,
            )}
            <div className='flex w-full justify-between'>
              <div>
                {(result.deduction_pph21 || 0) >= 0
                  ? 'Pajak PPh 21'
                  : 'Kelebihan Pemotongan PPh 21'}
              </div>
              <div>
                {Number(result.deduction_pph21) >= 0 ? '-' : ''}
                {handleWriteCurrency(Math.abs(result.deduction_pph21 || 0))}
              </div>
            </div>
            {(result.deduction_pph21 || 0) < 0 && (
              <div className='flex w-full justify-between'>
                <div>Apakah PPh 21 yang kelebihan akan dikembalikan?</div>
                <form className='flex space-x-4'>
                  <div className='flex space-x-1.5'>
                    <input
                      type='radio'
                      name='choice'
                      value='yes'
                      onClick={_ => setIsPPhReturned(true)}
                    />
                    <label>Yes</label>
                  </div>
                  <div className='flex space-x-1.5'>
                    <input
                      type='radio'
                      name='choice'
                      value='no'
                      onClick={_ => setIsPPhReturned(false)}
                    />
                    <label>No</label>
                  </div>
                </form>
              </div>
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                -{' '}
                {handleWriteCurrency(
                  Number(result.deduction_asuransi_pribadi) +
                    Number(result.deduction_amal) +
                    Number(result.deduction_bpjs_kesehatan) +
                    Number(result.deduction_bpjs_tk_jht) +
                    Number(result.deduction_bpjs_tk_jp) +
                    Number(
                      Number(result.deduction_pph21) > 0
                        ? result.deduction_pph21
                        : 0,
                    ),
                )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan Lainnya</h3>
            {reductions.map((reduction: ReductionProperty, index) => (
              <div key={index} className='flex w-full justify-between'>
                <div className='flex space-x-2 align-middle'>
                  <div onClick={_ => handleDeleteReduction(index)}>
                    <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                  </div>
                  <div>{reduction.ReductionName?.name}</div>
                </div>
                <div>- {handleWriteCurrency(reduction.amount)}</div>
              </div>
            ))}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                -{' '}
                {handleWriteCurrency(
                  reductions.reduce((acc, item) => acc + item.amount, 0),
                )}
              </div>
            </div>
            <div className='pt-3 font-bold'>Tambah Pengurangan Lain</div>
            <div className='flex space-x-2'>
              <div className='w-full'>
                <label className='block'>Jenis Pengurangan</label>
                <Select
                  options={reductionOptions}
                  onChange={handleSetReductionName}
                  className='w-full'
                />
              </div>
              <div className='w-full'>
                <label className='block'>Nominal</label>
                <input
                  value={newReductionNominal}
                  onChange={e => setNewReductionNominal(Number(e.target.value))}
                  type='number'
                  className='h-10 w-full rounded-md border border-gray-300'
                />
              </div>
            </div>
            <div className='pt-2'>
              <button
                type='submit'
                className='btn btn-info'
                onClick={handleAddNewReduction}
              >
                Tambah Pengurangan
              </button>
            </div>
          </div>
          {Number(result.tunjangan_pph) > 0 ? (
            <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
              <div className='flex w-full justify-between font-bold'>
                <div>Total Pengurangan Ditanggung Perusahaan</div>
                <div>{handleWriteCurrency(Number(result.deduction_pph21))}</div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Total Pengurangan Ditanggung Pribadi</div>
              <div>
                {handleWriteCurrency(
                  Number(
                    reductions.reduce((acc, item) => acc + item.amount, 0),
                  ) +
                    Number(result.deduction_amal) +
                    Number(result.deduction_asuransi_pribadi) +
                    Number(result.deduction_bpjs_kesehatan) +
                    Number(result.deduction_bpjs_tk_jht) +
                    Number(result.deduction_bpjs_tk_jp) +
                    Number(
                      Number(result.tunjangan_pph) > 0
                        ? 0
                        : result.deduction_pph21,
                    ),
                )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>
                Gaji Take Home (Total Pendapatan - Total Pengurangan Ditanggung
                Pribadi)
              </div>
              <div>{handleWriteCurrency(result.takeHomePay || 0)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayrollCalculatorResult;
