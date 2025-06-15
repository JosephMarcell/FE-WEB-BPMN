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
import { useCountSalarySlipWhite } from '@/app/api/hooks/hrm/salary_slip/useCountSalarySlipWhite';
import { useGetSalarySlipWhiteByPkid } from '@/app/api/hooks/hrm/salary_slip/useGetSalarySlipWhiteByPkid';
import { useUpdateSalarySlip } from '@/app/api/hooks/hrm/salary_slip/useUpdateSalarySlip';
import {
  allowanceInitialState,
  AllowanceProperty,
  GetSalarySlipWhiteSummarized,
  getSalarySlipWhiteSummarizedInitialState,
  reductionInitialState,
  ReductionProperty,
  SalarySlipProperty,
} from '@/helpers/utils/hrm/salary_slip';
interface IWhiteCollarSalarySlip {
  pkid: number;
}

const WhiteCollarSalarySlip = ({ pkid }: IWhiteCollarSalarySlip) => {
  const { data: salarySlipData } = useGetSalarySlipWhiteByPkid(pkid);
  const { data: allowanceList } = useGetAllAllowanceName();
  const { data: reductionList } = useGetAllReductionName();
  const {
    mutateAsync: countSalarySlipWhite,
    data: calculationResult,
    isPending,
  } = useCountSalarySlipWhite();
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
  const [result, setResult] = useState<GetSalarySlipWhiteSummarized>(
    getSalarySlipWhiteSummarizedInitialState,
  );
  const [newAllowanceName, setNewAllowanceName] = useState<Option>();
  const [newAllowanceNominal, setNewAllowanceNominal] = useState<number>(0);
  const [removedAllowance, setRemovedAllowance] = useState<number[]>([]);

  const [newReductionName, setNewReductionName] = useState<Option>();
  const [newReductionNominal, setNewReductionNominal] = useState<number>(0);
  const [removedReduction, setRemovedReduction] = useState<number[]>([]);

  const [isPPhReturned, setIsPPhReturned] = useState<boolean>(false);

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
      setResult(salarySlipData?.data);
      setIsPPhReturned(salarySlipData?.data.salary_slip.is_pph21_returned);
    }
  }, [salarySlipData]);

  useEffect(() => {
    if (calculationResult !== undefined) {
      setResult(currentResult => ({
        ...currentResult,
        count_output: calculationResult.data.countOutput,
      }));
    }
  }, [calculationResult]);

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
      const newAllowance = result.allowances?.concat({
        ...allowanceInitialState,
        amount: Number(newAllowanceNominal),
        AllowanceName: {
          pkid: Number(newAllowanceName?.value) || null,
          name: newAllowanceName?.label || null,
          type: null,
        },
      });

      setResult({
        ...result,
        allowances: newAllowance || result.allowances,
        allowance_total:
          Number(result.allowance_total) + Number(newAllowanceNominal),
      });

      if (result.count_input) {
        countSalarySlipWhite({
          ...result.count_input,
          tunjangan_lain:
            Number(result.allowance_total) + Number(newAllowanceNominal),
        });
      }

      setNewAllowanceNominal(0);
    }
  };

  const handleAddNewReduction = () => {
    if (newReductionName?.label && newReductionNominal !== 0) {
      if (
        Number(result.reduction_total) + Number(newReductionNominal) >
        Number(result.count_output?.takeHomePay)
      ) {
        Swal.fire(
          'Error!',
          'Reduction can not be bigger than take home pay.',
          'error',
        );
      } else {
        const newReduction = [
          ...(result.reductions || []), // Spread the existing reductions or an empty array if undefined
          {
            ...reductionInitialState,
            amount: Number(newReductionNominal),
            ReductionName: {
              pkid: Number(newReductionName?.value) || null,
              name: newReductionName?.label || null,
              type: null,
            },
          },
        ];

        setResult({
          ...result,
          reductions: newReduction || result.reductions,
          reduction_total:
            Number(result.reduction_total) + Number(newReductionNominal),
        });

        if (result.count_input) {
          countSalarySlipWhite({
            ...result.count_input,
            pengurangan_lain:
              Number(result.reduction_total) + Number(newReductionNominal),
          });
        }

        setNewReductionNominal(0);
      }
    }
  };

  const handleDeleteAllowance = (index: number) => {
    if (result.salary_slip?.status === 'Not Written In Journal') {
      const deletedAllowance = result.allowances?.find((_, i) => i === index);
      const newAllowance =
        result.allowances?.filter((_, i) => i !== index) || [];

      if (deletedAllowance?.pkid)
        setRemovedAllowance([...removedAllowance, deletedAllowance?.pkid]);

      if (newAllowance) {
        setResult({
          ...result,
          allowances: newAllowance,
          allowance_total:
            Number(result.allowance_total) - Number(deletedAllowance?.amount),
        });
      }

      if (result.count_input) {
        countSalarySlipWhite({
          ...result.count_input,
          pengurangan_lain:
            Number(result.allowance_total) - Number(deletedAllowance?.amount),
        });
      }
    }
  };

  const handleDeleteReduction = (index: number) => {
    if (result.salary_slip?.status === 'Not Written In Journal') {
      const deletedReduction = result.reductions?.find((_, i) => i === index);
      const newReduction =
        result.reductions?.filter((_, i) => i !== index) || [];

      if (deletedReduction?.pkid)
        setRemovedReduction([...removedReduction, deletedReduction?.pkid]);

      if (newReduction) {
        setResult({
          ...result,
          reductions: newReduction,
          reduction_total:
            Number(result.reduction_total) - Number(deletedReduction?.amount),
        });
      }

      if (result.count_input) {
        countSalarySlipWhite({
          ...result.count_input,
          pengurangan_lain:
            Number(result.reduction_total) - Number(deletedReduction?.amount),
        });
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
        const salaryData: SalarySlipProperty = {
          gaji_pokok: Number(result.count_input?.gaji_pokok),
          gaji_lembur: Number(result.count_input?.gaji_lembur),
          penalti: Number(result.count_input?.penalti),
          deduction_asuransi_pribadi: Number(
            result?.count_output?.deduction_asuransi_pribadi,
          ),
          deduction_amal: Number(result?.count_output?.deduction_amal),
          deduction_bpjs_kesehatan: Number(
            result?.count_output?.deduction_bpjs_kesehatan,
          ),
          deduction_bpjs_tk_jht: Number(
            result?.count_output?.deduction_bpjs_tk_jht,
          ),
          deduction_bpjs_tk_jp: Number(
            result?.count_output?.deduction_bpjs_tk_jp,
          ),
          deduction_pph21: Number(result?.count_output?.deduction_pph21),
          benefit_bpjs_kesehatan: Number(
            result?.count_output?.benefit_bpjs_kesehatan,
          ),
          benefit_bpjs_tk_jht: Number(
            result?.count_output?.benefit_bpjs_tk_jht,
          ),
          benefit_bpjs_tk_jkk: Number(
            result?.count_output?.benefit_bpjs_tk_jkk,
          ),
          benefit_bpjs_tk_jkm: Number(
            result?.count_output?.benefit_bpjs_tk_jkm,
          ),
          benefit_bpjs_tk_jp: Number(result?.count_output?.benefit_bpjs_tk_jp),
          gaji_take_home: Number(result?.count_output?.takeHomePay),
          status: status,
          employee_id: result.salary_slip?.employee_id || 0,
          tunjangan_jabatan: result.count_output?.tunjangan_tetap_position || 0,
          tunjangan_keluarga: result.count_output?.tunjangan_tetap_ptkp || 0,
          tunjangan_pph: result.count_output?.tunjangan_pph || 0,
          is_pph21_returned: isPPhReturned,
          year: result.salary_slip?.year || 0,
          month: result.salary_slip?.month || '',
          start_date: result.salary_slip?.start_date || '',
          last_date: result.salary_slip?.last_date || '',
          Employee: null,
        };

        await updateSalarySlip({
          pkid: pkid,
          data: salaryData,
        });

        await Promise.all(
          (result.allowances ?? []).map(async allowance => {
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
          (result.reductions ?? []).map(async reduction => {
            if (!reduction.pkid) {
              await createReduction({
                ss_id: pkid,
                amount: reduction.amount,
                reduction_name_id: reduction.ReductionName?.pkid || 0,
              });
            }
          }),
        );
      }

      if (status === 'Written In Journal') {
        try {
          createJournalFromSalarySlip({
            post_date: new Date(),
            notes: `Hutang Gaji Karyawan Per Tanggal ${new Date().toLocaleDateString()}`,
            amount:
              Number(result?.count_output?.takeHomePay) +
              Number(result?.count_output?.benefit_bpjs_kesehatan) +
              Number(result?.count_output?.benefit_bpjs_tk_jht) +
              Number(result?.count_output?.benefit_bpjs_tk_jkk) +
              Number(result?.count_output?.benefit_bpjs_tk_jkm) +
              Number(result?.count_output?.benefit_bpjs_tk_jp),
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
            amount:
              Number(result?.count_output?.takeHomePay) +
              Number(result?.count_output?.benefit_bpjs_kesehatan) +
              Number(result?.count_output?.benefit_bpjs_tk_jht) +
              Number(result?.count_output?.benefit_bpjs_tk_jkk) +
              Number(result?.count_output?.benefit_bpjs_tk_jkm) +
              Number(result?.count_output?.benefit_bpjs_tk_jp),
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

      await deleteAllowance({ data: removedAllowance });
      await deleteReduction({ data: removedReduction });

      Swal.fire('Saved!', 'Your salary slip has been saved.', 'success').then(
        () => {
          window.location.href = '/hrm/payroll/white_collar_salary_slip';
        },
      );
    } catch (error) {
      Swal.fire('Error!', 'An error has occured.', 'error');
    }

    setLoading(false);
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
        <h2 className='mb-4 text-2xl font-bold'>Slip Gaji Kerah Putih</h2>
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
              <div>Golongan</div>
              <div>
                {
                  result.salary_slip?.Employee?.Position.WhitePayroll
                    ?.nama_golongan
                }
              </div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Bulan</div>
              <div>{result.salary_slip?.month}</div>
            </div>
            <div className='flex w-full justify-between'>
              <div>Tahun</div>
              <div>{result.salary_slip?.year}</div>
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
                  ? handleWriteCurrency(result.count_output?.gaji_pokok || 0)
                  : handleWriteCurrency(result.salary_slip?.gaji_pokok || 0)}
              </div>
            </div>
            {renderByAmount(
              'Tunjangan Tetap - Jabatan',
              result.count_output?.tunjangan_tetap_position || 0,
              result.salary_slip?.tunjangan_jabatan || 0,
            )}
            {renderByAmount(
              'Tunjangan Tetap - Keluarga',
              result.count_output?.tunjangan_tetap_ptkp || 0,
              result.salary_slip?.tunjangan_keluarga || 0,
            )}
            {renderByAmount(
              'Penalti',
              result.count_input?.penalti || 0,
              result.salary_slip?.penalti || 0,
              true,
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      result.count_output?.penghasilanTetap || 0,
                    )
                  : handleWriteCurrency(
                      Number(result.salary_slip?.gaji_pokok) +
                        Number(result.salary_slip?.tunjangan_jabatan) +
                        Number(result.salary_slip?.tunjangan_keluarga) -
                        Number(result.salary_slip?.penalti),
                    )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pendapatan Tidak Tetap</h3>
            {renderByAmount(
              'Gaji Lembur',
              result.count_input?.gaji_lembur || 0,
              result.salary_slip?.gaji_lembur || 0,
            )}
            {(result.allowances || []).map(
              (allowance: AllowanceProperty, index) => (
                <div key={index} className='flex w-full justify-between'>
                  <div className='flex space-x-2 align-middle'>
                    {result.salary_slip?.status === 'Not Written In Journal' &&
                      salarySlipData?.headers['can_update'] === 'true' && (
                        <div onClick={_ => handleDeleteAllowance(index)}>
                          <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                        </div>
                      )}
                    <div>{allowance.AllowanceName?.name}</div>
                  </div>
                  <div>{handleWriteCurrency(allowance.amount)}</div>
                </div>
              ),
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>{handleWriteCurrency(result.allowance_total || 0)}</div>
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
            <h3 className='mb-3 text-lg font-bold'>Ditanggung Perusahaan</h3>
            {renderByAmount(
              'Tunjangan PPh',
              result.count_output?.tunjangan_pph || 0,
              result.salary_slip?.tunjangan_pph || 0,
            )}
            {renderByAmount(
              'BPJS Kesehatan',
              result.count_output?.benefit_bpjs_kesehatan || 0,
              result.salary_slip?.benefit_bpjs_kesehatan || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JHT',
              result.count_output?.benefit_bpjs_tk_jht || 0,
              result.salary_slip?.benefit_bpjs_tk_jht || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JKK',
              result.count_output?.benefit_bpjs_tk_jkk || 0,
              result.salary_slip?.benefit_bpjs_tk_jkk || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JKM',
              result.count_output?.benefit_bpjs_tk_jkm || 0,
              result.salary_slip?.benefit_bpjs_tk_jkm || 0,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JP',
              result.count_output?.benefit_bpjs_tk_jp || 0,
              result.salary_slip?.benefit_bpjs_tk_jp || 0,
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      Number(result.count_output?.benefit_bpjs_kesehatan) +
                        Number(result.count_output?.benefit_bpjs_tk_jht) +
                        Number(result.count_output?.benefit_bpjs_tk_jkk) +
                        Number(result.count_output?.benefit_bpjs_tk_jkm) +
                        Number(result.count_output?.tunjangan_pph) +
                        Number(result.count_output?.benefit_bpjs_tk_jp),
                    )
                  : handleWriteCurrency(
                      Number(result.salary_slip?.benefit_bpjs_kesehatan) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jht) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jkk) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jkm) +
                        Number(result.salary_slip?.tunjangan_pph) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jp),
                    )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Total Pendapatan</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      Number(result.count_output?.penghasilanTetap) +
                        Number(result.count_input?.gaji_lembur) +
                        Number(result.allowance_total),
                    )
                  : handleWriteCurrency(
                      Number(result.salary_slip?.gaji_pokok) +
                        Number(result.salary_slip?.tunjangan_jabatan) +
                        Number(result.salary_slip?.tunjangan_keluarga) -
                        Number(result.salary_slip?.penalti) +
                        Number(result.salary_slip?.gaji_lembur) +
                        Number(result.allowance_total),
                    )}
              </div>
            </div>
          </div>
          {Number(result.count_output?.tunjangan_pph) > 0 ||
          Number(result.salary_slip?.tunjangan_pph) ? (
            <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
              <div className='flex w-full justify-between font-bold'>
                <div>
                  Total Pendapatan & Ditanggung Perusahaan Sebelum Tunjangan PPh
                </div>
                <div>
                  {result.salary_slip?.status === 'Not Written In Journal'
                    ? handleWriteCurrency(
                        Number(result.count_output?.penghasilanTetap) +
                          Number(result.count_input?.gaji_lembur) +
                          Number(result.allowance_total) +
                          Number(result.count_output?.benefit_bpjs_kesehatan) +
                          Number(result.count_output?.benefit_bpjs_tk_jht) +
                          Number(result.count_output?.benefit_bpjs_tk_jkk) +
                          Number(result.count_output?.benefit_bpjs_tk_jkm) +
                          Number(result.count_output?.benefit_bpjs_tk_jp),
                      )
                    : handleWriteCurrency(
                        Number(result.salary_slip?.gaji_pokok) +
                          Number(result.salary_slip?.tunjangan_jabatan) +
                          Number(result.salary_slip?.tunjangan_keluarga) -
                          Number(result.salary_slip?.penalti) +
                          Number(result.salary_slip?.gaji_lembur) +
                          Number(result.allowance_total) +
                          Number(result.salary_slip?.tunjangan_pph) +
                          Number(result.salary_slip?.benefit_bpjs_kesehatan) +
                          Number(result.salary_slip?.benefit_bpjs_tk_jht) +
                          Number(result.salary_slip?.benefit_bpjs_tk_jkk) +
                          Number(result.salary_slip?.benefit_bpjs_tk_jkm) +
                          Number(result.salary_slip?.benefit_bpjs_tk_jp),
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
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      Number(result.count_output?.penghasilanTetap) +
                        Number(result.count_input?.gaji_lembur) +
                        Number(result.allowance_total) +
                        Number(result.count_output?.tunjangan_pph) +
                        Number(result.count_output?.benefit_bpjs_kesehatan) +
                        Number(result.count_output?.benefit_bpjs_tk_jht) +
                        Number(result.count_output?.benefit_bpjs_tk_jkk) +
                        Number(result.count_output?.benefit_bpjs_tk_jkm) +
                        Number(result.count_output?.benefit_bpjs_tk_jp),
                    )
                  : handleWriteCurrency(
                      Number(result.salary_slip?.gaji_pokok) +
                        Number(result.salary_slip?.tunjangan_jabatan) +
                        Number(result.salary_slip?.tunjangan_keluarga) -
                        Number(result.salary_slip?.penalti) +
                        Number(result.salary_slip?.gaji_lembur) +
                        Number(result.allowance_total) +
                        Number(result.salary_slip?.tunjangan_pph) +
                        Number(result.salary_slip?.benefit_bpjs_kesehatan) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jht) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jkk) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jkm) +
                        Number(result.salary_slip?.benefit_bpjs_tk_jp),
                    )}
              </div>
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan</h3>
            {renderByAmount(
              'Asuransi Pribadi',
              result.count_output?.deduction_asuransi_pribadi || 0,
              result.salary_slip?.deduction_asuransi_pribadi || 0,
              true,
            )}
            {renderByAmount(
              'Amal Pribadi',
              result.count_output?.deduction_amal || 0,
              result.salary_slip?.deduction_amal || 0,
              true,
            )}
            {renderByAmount(
              'BPJS Kesehatan',
              result.count_output?.deduction_bpjs_kesehatan || 0,
              result.salary_slip?.deduction_bpjs_kesehatan || 0,
              true,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JHT',
              result.count_output?.deduction_bpjs_tk_jht || 0,
              result.salary_slip?.deduction_bpjs_tk_jht || 0,
              true,
            )}
            {renderByAmount(
              'BPJS Ketenagakerjaan JP',
              result.count_output?.deduction_bpjs_tk_jp || 0,
              result.salary_slip?.deduction_bpjs_tk_jp || 0,
              true,
            )}

            {result.salary_slip?.status === 'Not Written In Journal' ? (
              <div className='flex w-full justify-between'>
                <div>
                  {(result.count_output?.deduction_pph21 || 0) >= 0
                    ? 'Pajak PPh 21'
                    : 'Kelebihan Pemotongan PPh 21'}
                </div>
                <div>
                  {(result.count_output?.deduction_pph21 || 0) >= 0 ? '-' : ''}
                  {handleWriteCurrency(
                    Math.abs(result.count_output?.deduction_pph21 || 0),
                  )}
                </div>
              </div>
            ) : (
              <div className='flex w-full justify-between'>
                <div>
                  {(result.salary_slip?.deduction_pph21 || 0) >= 0
                    ? 'Pajak PPh 21'
                    : 'Kelebihan Pemotongan PPh 21'}
                </div>
                <div>
                  {(result.salary_slip?.deduction_pph21 || 0) >= 0 ? '-' : ''}
                  {handleWriteCurrency(
                    Math.abs(result.salary_slip?.deduction_pph21 || 0),
                  )}
                </div>
              </div>
            )}
            {result.salary_slip?.status === 'Not Written In Journal'
              ? (result.count_output?.deduction_pph21 || 0) < 0 && (
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
                )
              : (result.salary_slip?.deduction_pph21 || 0) < 0 && (
                  <div className='flex w-full justify-between'>
                    <div>Apakah PPh 21 yang kelebihan akan dikembalikan?</div>
                    <form className='flex space-x-4'>
                      <div className='flex space-x-1.5'>
                        <input
                          type='radio'
                          name='choice'
                          value='yes'
                          onClick={_ => setIsPPhReturned(true)}
                          defaultChecked={result.salary_slip?.is_pph21_returned}
                        />
                        <label>Yes</label>
                      </div>
                      <div className='flex space-x-1.5'>
                        <input
                          type='radio'
                          name='choice'
                          value='no'
                          onClick={_ => setIsPPhReturned(false)}
                          defaultChecked={
                            !result.salary_slip?.is_pph21_returned
                          }
                        />
                        <label>No</label>
                      </div>
                    </form>
                  </div>
                )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              {result.salary_slip?.status === 'Not Written In Journal' ? (
                <div>
                  -{' '}
                  {handleWriteCurrency(
                    Number(result.count_output?.deduction_asuransi_pribadi) +
                      Number(result.count_output?.deduction_amal) +
                      Number(result.count_output?.deduction_bpjs_kesehatan) +
                      Number(result.count_output?.deduction_bpjs_tk_jht) +
                      Number(result.count_output?.deduction_bpjs_tk_jp) +
                      Number(
                        Number(result.count_output?.deduction_pph21) > 0
                          ? result.count_output?.deduction_pph21
                          : 0,
                      ),
                  )}
                </div>
              ) : (
                <div>
                  -{' '}
                  {handleWriteCurrency(
                    Number(result.salary_slip?.deduction_asuransi_pribadi) +
                      Number(result.salary_slip?.deduction_amal) +
                      Number(result.salary_slip?.deduction_bpjs_kesehatan) +
                      Number(result.salary_slip?.deduction_bpjs_tk_jht) +
                      Number(result.salary_slip?.deduction_bpjs_tk_jp) +
                      Number(
                        Number(result.salary_slip?.deduction_pph21) > 0
                          ? result.salary_slip?.deduction_pph21
                          : 0,
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <h3 className='mb-3 text-lg font-bold'>Pengurangan Lainnya</h3>
            {(result.reductions || []).map(
              (reduction: ReductionProperty, index) => (
                <div key={index} className='flex w-full justify-between'>
                  <div className='flex space-x-2 align-middle'>
                    {result.salary_slip?.status === 'Not Written In Journal' &&
                      salarySlipData?.headers['can_update'] === 'true' && (
                        <div onClick={_ => handleDeleteReduction(index)}>
                          <IconTrashLines className='cursor-pointer rounded bg-red-500 p-0.5 text-white' />
                        </div>
                      )}
                    <div>{reduction.ReductionName?.name}</div>
                  </div>
                  <div>- {handleWriteCurrency(reduction.amount)}</div>
                </div>
              ),
            )}
            <div className='flex w-full justify-between pt-3 font-bold'>
              <div>Total</div>
              <div>- {handleWriteCurrency(result.reduction_total || 0)}</div>
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
          {Number(result.count_output?.tunjangan_pph) > 0 ||
          Number(result.salary_slip?.tunjangan_pph) > 0 ? (
            <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
              <div className='flex w-full justify-between font-bold'>
                <div>Total Pengurangan Ditanggung Perusahaan</div>
                <div>
                  {result.salary_slip?.status === 'Not Written In Journal'
                    ? handleWriteCurrency(
                        Number(result.count_output?.deduction_pph21),
                      )
                    : handleWriteCurrency(
                        Number(result.salary_slip?.deduction_pph21),
                      )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className='mb-4 w-full space-y-1 rounded bg-white p-4 shadow-lg'>
            <div className='flex w-full justify-between font-bold'>
              <div>Total Pengurangan Ditanggung Pribadi</div>
              <div>
                {result.salary_slip?.status === 'Not Written In Journal'
                  ? handleWriteCurrency(
                      Number(result.reduction_total || 0) +
                        Number(result.count_output?.deduction_amal) +
                        Number(
                          result.count_output?.deduction_asuransi_pribadi,
                        ) +
                        Number(result.count_output?.deduction_bpjs_kesehatan) +
                        Number(result.count_output?.deduction_bpjs_tk_jht) +
                        Number(result.count_output?.deduction_bpjs_tk_jp) +
                        Number(
                          Number(result.count_output?.tunjangan_pph) > 0
                            ? 0
                            : result.count_output?.deduction_pph21,
                        ),
                    )
                  : handleWriteCurrency(
                      Number(result.reduction_total || 0) +
                        Number(result.salary_slip?.deduction_amal) +
                        Number(result.salary_slip?.deduction_asuransi_pribadi) +
                        Number(result.salary_slip?.deduction_bpjs_kesehatan) +
                        Number(result.salary_slip?.deduction_bpjs_tk_jht) +
                        Number(result.salary_slip?.deduction_bpjs_tk_jp) +
                        Number(
                          Number(result.salary_slip?.tunjangan_pph) > 0
                            ? 0
                            : result.salary_slip?.deduction_pph21,
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
              {result.salary_slip?.status === 'Not Written In Journal' ? (
                <div>
                  {handleWriteCurrency(
                    Number(result.count_output?.takeHomePay),
                  )}
                </div>
              ) : (
                <div>
                  {handleWriteCurrency(
                    Number(result.salary_slip?.gaji_take_home),
                  )}
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

export default WhiteCollarSalarySlip;
