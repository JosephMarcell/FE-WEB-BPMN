import { useSelector } from 'react-redux';

import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';

import { IRootState } from '@/store';

import { renderLargaData } from '@/helpers/utils/general_ledger/dataProcessing';

interface ActionComponentProps {
  title?: string;
}
const ActionComponent = ({ title }: ActionComponentProps) => {
  const cashFlowData = useSelector(
    (state: IRootState) => state.cashFlows.cashFlowData,
  );

  return (
    <div className='panel border-white-light px-0'>
      <div className='mb-5 flex flex-col gap-5 px-5 md:flex-row md:items-center'>
        {title && <h2 className='text-xl font-semibold'>{title}</h2>}
        <div className='flex items-center gap-5 ltr:ml-auto rtl:mr-auto'>
          <div className='flex flex-wrap items-center'>
            <button
              type='button'
              // onClick={() => exportTable('csv')}
              className='btn btn-dark btn-sm m-1 '
            >
              <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
              Bulk Insert
            </button>
            <button
              type='button'
              // onClick={() => exportTable('csv')}
              className='btn btn-success btn-sm m-1 '
            >
              <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
              CSV
            </button>
            <button
              type='button'
              // onClick={() => exportTable('txt')}
              className='btn btn-info btn-sm m-1'
            >
              <IconFile className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
              TXT
            </button>

            <button
              type='button'
              // onClick={() => exportTable('print')}
              className='btn btn-primary btn-sm m-1'
            >
              <IconPrinter className='ltr:mr-2 rtl:ml-2' />
              PRINT
            </button>
          </div>
        </div>
      </div>
      <div className='datatables pagination-padding px-5'>
        <div className=''>
          <thead>
            <tr className='h-17 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='whitespace-no-wrap w-full break-all pl-5 pr-5 text-center'
              >
                <span className='font-courier text-lg leading-tight text-black'>
                  ITS ERP Company
                </span>
              </td>
              <td></td>
            </tr>
            <tr className='h-23 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='w-539 whitespace-no-wrap break-all pl-5 pr-5 pt-3 text-center'
              >
                <span className='font-arial text-3xl font-bold leading-tight text-black'>
                  Laporan Arus Kas
                </span>
              </td>
              <td></td>
            </tr>
            <tr className='h-6 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='w-539 whitespace-no-wrap break-all pl-5 pr-5 pt-3 text-center'
              >
                <span className='font-courier text-xs leading-tight text-black'>
                  Per Periode{' '}
                  {`${cashFlowData.periods.start_month ?? '-'} / ${
                    cashFlowData.periods.start_year ?? '-'
                  } s/d ${cashFlowData.periods.end_month ?? '-'} / ${
                    cashFlowData.periods.end_year ?? '-'
                  }`}
                </span>
              </td>
              <td></td>
            </tr>
            <tr className='h-6 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='w-539 whitespace-no-wrap break-all pl-5 pr-5 pt-3 text-center'
              >
                <span className='font-courier ml-auto text-xs leading-tight text-black'>
                  Mata Uang : IDR
                </span>
              </td>
              <td></td>
            </tr>
          </thead>
          <div className='flex flex-col gap-2 space-y-1'>
            <p className='font-bold'>Aktifitas Operasi</p>
            <div className='flex justify-between'>
              <p className='text-black'>&nbsp;&nbsp;&nbsp;Laba/Rugi</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[6]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Tambah Akumulasi Penyusutan
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[0]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>&nbsp;&nbsp;&nbsp;Tambah Utang Usaha</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[1]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Tambah Liabilitas Jangka Pendek
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[2]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Kurang Piutang Usaha
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[3]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>&nbsp;&nbsp;&nbsp;Kurang Persediaan</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[4]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Kurang Aset Lancar Lainnya
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.listActivity[5]?.value,
                )}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>Total Aktfitas Operasi</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.operationActivity.totalOperationActivity,
                )}
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 space-y-1'>
            <p className='font-bold'>Aktifitas Investasi</p>
            <div className='flex justify-between'>
              <p className='text-black'>&nbsp;&nbsp;&nbsp;Kurang Aset Tetap</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.investmentActivity.listActivity[0]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Kurang Aset Lainnya
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.investmentActivity.listActivity[1]?.value,
                )}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>Total Investasi</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.investmentActivity.totalInvestmentActivity,
                )}
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 space-y-1'>
            <p className='font-bold'>Aktifitas Pendanaan</p>
            <div className='flex justify-between'>
              <p className='text-black'>
                &nbsp;&nbsp;&nbsp;Tambah Liabilitas Jangka Panjang
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.fundingActivity.listActivity[0]?.value,
                )}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-black'>&nbsp;&nbsp;&nbsp;Tambah Modal</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.fundingActivity.listActivity[1]?.value,
                )}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>Total Pendanaan</p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.fundingActivity.totalFundingActivity,
                )}
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 space-y-1'>
            <p className='font-bold'></p>
            <div className='flex justify-between'>
              <p className='font-bold text-black'>
                Total dari Arus Kas Bersih yang digunakan (dipakai) di periode
                ini
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.dataCalculation.totalCashBankThisPeriod,
                )}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>
                Kas & Setara Kas di Awal period
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.dataCalculation.totalCashBankInInitialPeriod,
                )}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>
                Kas & Setara Kas di Akhir period
              </p>
              <p className='text-black'>
                {renderLargaData(
                  cashFlowData.dataCalculation.totalCashBankInFinalPeriod,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionComponent;
