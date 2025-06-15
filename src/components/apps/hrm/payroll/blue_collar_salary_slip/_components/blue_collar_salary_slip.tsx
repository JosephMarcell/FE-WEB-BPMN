import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { writeCurrency } from '@/lib/money';
import { Option } from '@/lib/view';

import IconTrashLines from '@/components/icon/icon-trash-lines';

import { useCreateJournalFromSalarySlip } from '@/app/api/hooks/general_ledger/journal/useCreateJournalFromSalarySlip';
import { useCreateJournalPaySalarySlip } from '@/app/api/hooks/general_ledger/journal/useCreateJournalPaySalarySlip';
import { useCreateAllowance } from '@/app/api/hooks/hrm/allowance/useCreateAllowance';
import { useDeleteAllowance } from '@/app/api/hooks/hrm/allowance/useDeleteAllowance';
import { useGetAllAllowanceName } from '@/app/api/hooks/hrm/allowance/useGetAllAllowanceName';
import { useCreateReduction } from '@/app/api/hooks/hrm/reduction/useCreateReduction';
import { useDeleteReduction } from '@/app/api/hooks/hrm/reduction/useDeleteReduction';
import { useGetAllReductionName } from '@/app/api/hooks/hrm/reduction_name/useGetAllReductionName';
import { useGetSalarySlipBlueByPkid } from '@/app/api/hooks/hrm/salary_slip/useGetSalarySlipBlueByPkid';
import { useUpdateSalarySlip } from '@/app/api/hooks/hrm/salary_slip/useUpdateSalarySlip';
import {
  allowanceInitialState,
  AllowanceProperty,
  GetSalarySlipBlueSummarized,
  getSalarySlipBlueSummarizedInitialState,
  reductionInitialState,
  ReductionProperty,
  SalarySlipProperty,
} from '@/helpers/utils/hrm/salary_slip';

interface IBlueCollarSalarySlip {
  pkid: number;
}

const BlueCollarSalarySlip = ({ pkid }: IBlueCollarSalarySlip) => {
  const [allowances, setAllowances] = useState<AllowanceProperty[]>([]);
  const [newAllowanceName, setNewAllowanceName] = useState<Option>();
  const [newAllowanceNominal, setNewAllowanceNominal] = useState<number>(0);
  const [removedAllowance, setRemovedAllowance] = useState<number[]>([]);
  const [totalNewAllowance, setTotalNewAllowance] = useState<number>(0);

  const [reductions, setReductions] = useState<ReductionProperty[]>([]);
  const [newReductionName, setNewReductionName] = useState<Option>();
  const [newReductionNominal, setNewReductionNominal] = useState<number>(0);
  const [removedReduction, setRemovedReduction] = useState<number[]>([]);
  const [totalNewReduction, setTotalNewReduction] = useState<number>(0);

  const {
    data: salarySlipData,
    refetch,
    isFetching,
  } = useGetSalarySlipBlueByPkid(pkid, totalNewAllowance, totalNewReduction);
  const { data: allowanceList } = useGetAllAllowanceName();
  const { data: reductionList } = useGetAllReductionName();
  const { mutateAsync: updateSalarySlip } = useUpdateSalarySlip();
  const { mutateAsync: createAllowance } = useCreateAllowance();
  const { mutateAsync: deleteAllowance } = useDeleteAllowance();
  const { mutateAsync: createReduction } = useCreateReduction();
  const { mutateAsync: deleteReduction } = useDeleteReduction();
  const { mutateAsync: createJournalFromSalarySlip } =
    useCreateJournalFromSalarySlip();
  const { mutateAsync: createJournalPaySalarySlip } =
    useCreateJournalPaySalarySlip();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GetSalarySlipBlueSummarized>(
    getSalarySlipBlueSummarizedInitialState,
  );

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
    if (salarySlipData !== undefined) {
      setResult({
        ...salarySlipData?.data,
      });
    }
    if (result.salary_slip === null) {
      setAllowances(salarySlipData?.data.allowances);
      setReductions(salarySlipData?.data.reductions);
    }
  }, [salarySlipData, result]);

  useEffect(() => {
    refetch();
  }, [totalNewAllowance, totalNewReduction, refetch]);

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handleSetAllowanceName = (
    selectedOption: SingleValue<Option> | null,
  ) => {
    if (selectedOption) {
      setNewAllowanceName({
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
    }
  };

  const handleSetReductionName = (
    selectedOption: SingleValue<Option> | null,
  ) => {
    if (selectedOption) {
      setNewReductionName({
        value: Number(selectedOption.value),
        label: selectedOption.label,
      });
    }
  };

  const handleAddNewAllowance = () => {
    if (newAllowanceName?.label && newAllowanceNominal !== 0) {
      const newAllowance = allowances?.concat({
        ...allowanceInitialState,
        amount: Number(newAllowanceNominal),
        AllowanceName: {
          pkid: Number(newAllowanceName?.value) || null,
          name: newAllowanceName?.label || null,
          type: null,
        },
      });

      if (newAllowanceName && result.input?.tunjangan_lain !== undefined) {
        setResult({
          ...result,
          input: {
            ...result?.input,
            tunjangan_lain:
              Number(result?.input?.tunjangan_lain) +
              Number(newAllowanceNominal),
          },
        });

        setAllowances(newAllowance);

        setTotalNewAllowance(totalNewAllowance + newAllowanceNominal);
        setNewAllowanceNominal(0);
      }
    }
  };

  const handleAddNewReduction = () => {
    if (newReductionName?.label && newReductionNominal !== 0) {
      if (
        Number(totalNewReduction) + Number(newReductionNominal) >
        Number(result.output?.takeHomePay)
      ) {
        Swal.fire(
          'Error!',
          'Reduction can not be bigger than take home pay.',
          'error',
        );
      } else {
        const newReduction = reductions?.concat({
          ...reductionInitialState,
          amount: Number(newReductionNominal),
          ReductionName: {
            pkid: Number(newReductionName?.value) || null,
            name: newReductionName?.label || null,
          },
        });

        if (newReductionName && result.input?.pengurangan_lain !== undefined) {
          setResult({
            ...result,
            input: {
              ...result?.input,
              pengurangan_lain:
                Number(result?.input?.pengurangan_lain) +
                Number(newReductionNominal),
            },
          });

          setReductions(newReduction);

          setTotalNewReduction(totalNewReduction + newReductionNominal);
          setNewReductionNominal(0);
        }
      }
    }
  };

  const handleDeleteAllowance = (index: number) => {
    if (result.salary_slip?.status === 'Not Written In Journal') {
      const deletedAllowance = allowances.find((_, i) => i === index);
      const newAllowance = allowances.filter((_, i) => i !== index);

      if (deletedAllowance?.pkid)
        setRemovedAllowance([...removedAllowance, deletedAllowance?.pkid]);

      if (result.input && deletedAllowance) {
        setAllowances(newAllowance);
        setResult({
          ...result,
          input: {
            ...result?.input,
            tunjangan_lain:
              Number(result?.input?.tunjangan_lain) -
              Number(deletedAllowance.amount),
          },
        });

        setTotalNewAllowance(
          Number(totalNewAllowance) - Number(deletedAllowance.amount),
        );
      }
    }
  };

  const handleDeleteReduction = (index: number) => {
    if (result.salary_slip?.status === 'Not Written In Journal') {
      const deletedReduction = reductions.find((_, i) => i === index);
      const newReduction = reductions.filter((_, i) => i !== index);

      if (deletedReduction?.pkid)
        setRemovedReduction([...removedReduction, deletedReduction?.pkid]);

      if (result.input && deletedReduction) {
        setReductions(newReduction);
        setResult({
          ...result,
          input: {
            ...result?.input,
            pengurangan_lain:
              Number(result?.input?.pengurangan_lain) -
              Number(deletedReduction.amount),
          },
        });
        setTotalNewReduction(
          Number(totalNewReduction) - Number(deletedReduction.amount),
        );
      }
    }
  };

  const handleSave = async (status: string) => {
    setLoading(true);

    try {
      if (
        status === 'Not Written In Journal' ||
        status === 'Written In Journal'
      ) {
        if (result.output && result.input && result.salary_slip) {
          const salaryData: SalarySlipProperty = {
            gaji_pokok: result.input.gaji_pokok ?? 0,
            penalti: result.input.penalti ?? 0,
            deduction_asuransi_pribadi:
              result.output?.deduction_asuransi_pribadi ?? 0,
            deduction_amal: result.output?.deduction_amal ?? 0,
            deduction_pph21: result.output?.deduction_pph21 ?? 0,
            gaji_take_home: result.output?.takeHomePay ?? 0,
            status: status,
            employee_id: result.salary_slip?.employee_id || 0,
            gaji_lembur: 0,
            deduction_bpjs_kesehatan: 0,
            tunjangan_pph: 0,
            tunjangan_jabatan: 0,
            tunjangan_keluarga: 0,
            deduction_bpjs_tk_jht: 0,
            deduction_bpjs_tk_jp: 0,
            benefit_bpjs_kesehatan: 0,
            benefit_bpjs_tk_jht: 0,
            benefit_bpjs_tk_jkk: 0,
            benefit_bpjs_tk_jkm: 0,
            benefit_bpjs_tk_jp: 0,
            is_pph21_returned: false,
            year: result.salary_slip.year ?? 0,
            month: result.salary_slip.month ?? '',
            start_date: result.salary_slip.start_date ?? '',
            last_date: result.salary_slip.last_date ?? '',
            Employee: null,
          };

          await updateSalarySlip({
            pkid: pkid,
            data: salaryData,
          });

          await Promise.all(
            (allowances ?? []).map(async allowance => {
              if (!allowance.pkid) {
                await createAllowance({
                  ss_id: pkid,
                  amount: allowance.amount,
                  allowance_name_id: allowance.AllowanceName?.pkid || 0,
                });
              }
            }),
          );

          await Promise.all(
            (reductions ?? []).map(async reduction => {
              if (!reduction.pkid) {
                await createReduction({
                  ss_id: pkid,
                  amount: reduction.amount,
                  reduction_name_id: reduction.ReductionName?.pkid || 0,
                });
              }
            }),
          );

          await deleteAllowance({ data: removedAllowance });
          await deleteReduction({ data: removedReduction });

          setTotalNewAllowance(0);
          setTotalNewReduction(0);
        }
      }

      if (status === 'Written In Journal') {
        try {
          createJournalFromSalarySlip({
            post_date: new Date(),
            notes: `Hutang Gaji Karyawan Per Tanggal ${new Date().toLocaleDateString()}`,
            amount: Number(result.output?.takeHomePay),
            approval_status: true,
            post_status: true,
            transaction_type_pkid: 5,
            // Adding the missing properties with placeholder values
            code: 'YourCodeHere',
            ref: 'YourReferenceHere',
            accounting_period_pkid: 1, // Assuming an integer ID, adjust as necessary
            numbering_pkid: 22, // Assuming an integer ID, adjust as necessary
            work_centre_pkid: 1, // Assuming an integer ID, adjust as necessary
            JournalDetails: [], // Assuming an empty array, adjust as necessary
          });
        } catch (error) {
          alert(error);
        }
      }

      if (status === 'Paid') {
        await updateSalarySlip({
          pkid: pkid,
          data: {
            ...salarySlipData?.data.salary_slip,
            status: status,
          },
        });

        try {
          createJournalPaySalarySlip({
            post_date: new Date(),
            notes: `Beban Gaji Karyawan Per Tanggal ${new Date().toLocaleDateString()}`,
            amount: Number(result.salary_slip?.gaji_take_home),
            approval_status: true,
            post_status: true,
            transaction_type_pkid: 5,
            // Adding the missing properties with placeholder values
            code: 'YourCodeHere',
            ref: 'YourReferenceHere',
            accounting_period_pkid: 1, // Assuming an integer ID, adjust as necessary
            numbering_pkid: 21, // Assuming an integer ID, adjust as necessary
            work_centre_pkid: 1, // Assuming an integer ID, adjust as necessary
            JournalDetails: [], // Assuming an empty array, adjust as necessary
          });
        } catch (error) {
          alert(error);
        }
      }

      Swal.fire('Saved!', 'Your salary slip has been saved.', 'success').then(
        () => {
          window.location.href = '/hrm/payroll/blue_collar_salary_slip';
        },
      );
    } catch (error) {
      Swal.fire('Error!', 'An error has occured.', 'error');
    }

    setLoading(false);
  };

  const renderByAmount = (
    title: string,
    count_amount: number,
    written_amount: number,
    has_negative = false,
  ) => {
    return (
      <>
        {result.salary_slip?.status === 'Not Written In Journal'
          ? count_amount > 0 && (
              <div className='flex w-full justify-between'>
                <div>{title}</div>
                <div>
                  {has_negative ? '- ' : ''}
                  {handleWriteCurrency(count_amount)}
                </div>
              </div>
            )
          : written_amount > 0 && (
              <div className='flex w-full justify-between'>
                <div>{title}</div>
                <div>
                  {has_negative ? '- ' : ''}
                  {handleWriteCurrency(written_amount)}
                </div>
              </div>
            )}
      </>
    );
  };

  return (
    <>
      {isFetching && (
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
        {loading && (
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
        <h2 className='mb-4 text-2xl font-bold'>Slip Gaji Kerah Biru</h2>
        <div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Profil Pegawai</h3>
            <div className='flex w-full justify-between'>
              <div>Nama</div>
              <div>{result.salary_slip?.Employee?.fullname}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>NIP</div>
              <div>{result.salary_slip?.Employee?.nip}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Jabatan</div>
              <div>{result.salary_slip?.Employee?.Position.name}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Tanggal Pertama</div>
              <div>{(result.salary_slip?.start_date || '').split('T')[0]}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Tanggal Terakhir</div>
              <div>{(result.salary_slip?.last_date || '').split('T')[0]}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Status Slip Gaji</div>
              <div>{result.salary_slip?.status}</div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pendapatan Tetap</h3>
            <div className='flex w-full justify-between'>
              <div>Gaji Tetap</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(result.input?.gaji_pokok || 0)
                  : handleWriteCurrency(result.salary_slip?.gaji_pokok || 0)}
              </div>
            </div>
            {renderByAmount(
              'Penalti',
              result.input?.penalti || 0,
              result.salary_slip?.penalti || 0,
              true,
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(result.output?.penghasilanTetap || 0)
                  : handleWriteCurrency(
                      (result.salary_slip?.gaji_pokok || 0) -
                        (result.salary_slip?.penalti || 0),
                    )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pendapatan Tidak Tetap</h3>
            {(allowances || []).map((allowance: AllowanceProperty, index) => (
              <div key={index} className='flex w-full justify-between'>
                <div className='flex space-x-2 align-middle'>
                  {result.salary_slip?.status === 'Not Written In Journal' && (
                    <div onClick={_ => handleDeleteAllowance(index)}>
                      <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                    </div>
                  )}
                  <div>{allowance.AllowanceName?.name}</div>
                </div>
                <div>{handleWriteCurrency(allowance.amount)}</div>
              </div>
            ))}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {handleWriteCurrency(result.input?.tunjangan_lain || 0)}
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
                  isDisabled={
                    result.salary_slip?.status !== 'Not Written In Journal'
                  }
                />
              </div>
              <div className='w-full'>
                <label className='block'>Nominal</label>
                <input
                  value={newAllowanceNominal}
                  onChange={e => setNewAllowanceNominal(Number(e.target.value))}
                  type='number'
                  className='h-10 w-full rounded-md border border-gray-300'
                  disabled={
                    result.salary_slip?.status !== 'Not Written In Journal'
                  }
                />
              </div>
            </div>
            <div className='pt-2'>
              <button
                type='submit'
                className='btn btn-info'
                onClick={handleAddNewAllowance}
                disabled={
                  result.salary_slip?.status !== 'Not Written In Journal' ||
                  salarySlipData?.headers['can_update'] !== 'true'
                }
              >
                Tambah Tunjangan
              </button>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan</h3>
            {renderByAmount(
              'Asuransi Pribadi',
              result.output?.deduction_asuransi_pribadi || 0,
              result.salary_slip?.deduction_asuransi_pribadi || 0,
              true,
            )}
            {renderByAmount(
              'Amal',
              result.output?.deduction_amal || 0,
              result.salary_slip?.deduction_amal || 0,
              true,
            )}
            <div className='flex w-full justify-between'>
              <div>Pajak PPh 21</div>
              <div>
                -{' '}
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(result.output?.deduction_pph21 || 0)
                  : handleWriteCurrency(
                      result.salary_slip?.deduction_pph21 || 0,
                    )}
              </div>
            </div>
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                -{' '}
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      Number(result.output?.deduction_asuransi_pribadi) +
                        Number(result.output?.deduction_amal) +
                        Number(result.output?.deduction_pph21),
                    )
                  : handleWriteCurrency(
                      Number(result.salary_slip?.deduction_asuransi_pribadi) +
                        Number(result.salary_slip?.deduction_amal) +
                        Number(result.salary_slip?.deduction_pph21),
                    )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan Lainnya</h3>
            {(reductions || []).map((reduction: ReductionProperty, index) => (
              <div key={index} className='flex w-full justify-between'>
                <div className='flex space-x-2 align-middle'>
                  {result.salary_slip?.status === 'Not Written In Journal' && (
                    <div onClick={_ => handleDeleteReduction(index)}>
                      <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                    </div>
                  )}
                  <div>{reduction.ReductionName?.name}</div>
                </div>
                <div>- {handleWriteCurrency(reduction.amount)}</div>
              </div>
            ))}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                - {handleWriteCurrency(result.input?.pengurangan_lain || 0)}
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
                  isDisabled={
                    result.salary_slip?.status !== 'Not Written In Journal'
                  }
                />
              </div>
              <div className='w-full'>
                <label className='block'>Nominal</label>
                <input
                  value={newReductionNominal}
                  onChange={e => setNewReductionNominal(Number(e.target.value))}
                  type='number'
                  className='h-10 w-full rounded-md border border-gray-300'
                  disabled={
                    result.salary_slip?.status !== 'Not Written In Journal'
                  }
                />
              </div>
            </div>
            <div className='pt-2'>
              <button
                type='submit'
                className='btn btn-info'
                onClick={handleAddNewReduction}
                disabled={
                  result.salary_slip?.status !== 'Not Written In Journal' ||
                  salarySlipData?.headers['can_update'] !== 'true'
                }
              >
                Tambah Pengurangan
              </button>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Gaji Take Home</div>
              {result.salary_slip?.status === 'Not Written In Journal' ? (
                <div>
                  {handleWriteCurrency(result.output?.takeHomePay || 0)}
                </div>
              ) : (
                <div>
                  {handleWriteCurrency(result.salary_slip?.gaji_take_home || 0)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          {result.salary_slip?.status === 'Not Written In Journal' &&
            salarySlipData?.headers['can_update'] === 'true' && (
              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  onClick={() => {
                    handleSave('Not Written In Journal');
                  }}
                >
                  Simpan
                </button>
                <button
                  type='submit'
                  className='btn btn-success'
                  onClick={() => {
                    handleSave('Written In Journal');
                  }}
                >
                  Simpan & Rekap
                </button>
              </div>
            )}
          {result.salary_slip?.status === 'Written In Journal' &&
            salarySlipData?.headers['can_update'] === 'true' && (
              <div className='flex space-x-2'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  onClick={() => {
                    handleSave('Paid');
                  }}
                >
                  Sudah Dibayar
                </button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default BlueCollarSalarySlip;
