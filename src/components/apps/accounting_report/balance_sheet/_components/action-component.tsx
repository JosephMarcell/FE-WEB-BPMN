import { useSelector } from 'react-redux';

import MapData from '@/components/apps/accounting_report/balance_sheet/_components/map-data';
import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';

import { IRootState } from '@/store';

import { renderLargaData } from '@/helpers/utils/general_ledger/dataProcessing';

interface ActionComponentProps {
  title?: string;
}
const ActionComponent = ({ title }: ActionComponentProps) => {
  const balanceSheetData = useSelector(
    (state: IRootState) => state.balanceSheets.balanceSheetData,
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
                  Laporan Neraca
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
                  Per Tanggal{' '}
                  {`${balanceSheetData?.periods?.end_date ?? '-'} 
                  `}
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
          {/* ASET  */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>ASET</p>
            <div className='ml-3 flex flex-col gap-2'>
              <p className='font-bold text-black'>ASET LANCAR</p>
              <div className='ml-3 flex flex-col gap-2'>
                <MapData
                  title='Kas dan setarah kas'
                  data={balanceSheetData.cashAndBanks}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.cashAndBanks[0]?.coa_account_type,
                  // )}
                />
                <p className='font-bold text-black'>Piutang Usaha</p>
                <MapData
                  title='Piutang Usaha'
                  data={balanceSheetData?.businessLoans}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.businessLoans[0]?.coa_account_type,
                  // )}
                />
                <p className='font-bold text-black'>Persediaan</p>
                <MapData
                  title='Persediaan'
                  data={balanceSheetData?.supplies}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.supplies[0]?.coa_account_type,
                  // )}
                />
                <p className='font-bold text-black'>Aset Lancar Lainnya</p>
                <MapData
                  title='Aset Lancar Lainnya'
                  data={balanceSheetData?.otherCurrentAssets}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.otherCurrentAssets[0]?.coa_account_type,
                  // )}
                />
              </div>
              <hr />
              <div className='flex justify-between'>
                <p className='font-bold text-black'>Jumlah Aset Lancar</p>
                <p className='text-black'>
                  {renderLargaData(balanceSheetData?.totalCurrentAssets)}
                </p>
              </div>
            </div>
            <div className='ml-3 flex flex-col gap-2'>
              <p className='font-bold text-black'>ASET TIDAK LANCAR</p>
              <div className='ml-3 flex flex-col gap-2'>
                <p className='font-bold text-black'>Nilai Historis</p>
                <MapData
                  title='Nilai Historis'
                  data={balanceSheetData?.historicalValues}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.historicalValues[0]?.coa_account_type,
                  // )}
                />
                <p className='font-bold text-black'>Akumulasi Penyusutan</p>
                <MapData
                  title='Akumulasi Penyusutan'
                  data={balanceSheetData?.AccumulatedDepreciation}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.AccumulatedDepreciation[0]?.coa_account_type,
                  // )}
                />
              </div>
              <hr />
              {/* <p className='text-black font-bold'>Jumlah Aset Tidak Lancar</p> */}
              <div className='flex justify-between'>
                <p className='font-bold text-black'>Jumlah Aset Tidak Lancar</p>
                <p className='text-black'>
                  {renderLargaData(balanceSheetData?.totalNonCurrentAssets)}
                </p>
              </div>
            </div>
            <div className='ml-3 flex flex-col gap-2'>
              <p className='font-bold text-black'>Aset Lainnya</p>
              <MapData
                title='Aset Lainnya'
                data={balanceSheetData?.otherAssets}
                // toDetail={routeToDetail(
                //   balanceSheet?.otherAssets[0]?.coa_account_type,
                // )}
              />
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>JUMLAH ASET</p>
              <p className='font-bold text-black'>
                {renderLargaData(balanceSheetData?.totalAssets)}
              </p>
            </div>
          </div>
          {/* LIABILITAS */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>LIABILITAS DAN EKUITAS</p>
            <div className='ml-3 flex flex-col gap-2'>
              <p className='font-bold text-black'>LIABILITAS</p>
              <div className='ml-3 flex flex-col gap-2'>
                <p className='font-bold text-black'>LIABILITAS JANGKA PENDEK</p>
                <div className='ml-3 flex flex-col gap-2'>
                  <p className='font-bold text-black'>Utang Usaha</p>
                  <MapData
                    title='Utang Usaha'
                    data={balanceSheetData?.businessDebts}
                    // toDetail={routeToDetail(
                    //   balanceSheet?.businessDebts[0]?.coa_account_type,
                    // )}
                  />
                  <p className='font-bold text-black'>
                    Kewajiban Jangka Pendek Lainnya
                  </p>
                  <MapData
                    title='Kewajiban Jangka Pendek Lainnya'
                    data={balanceSheetData?.shortTermLiabilities}
                    // toDetail={routeToDetail(
                    //   balanceSheet?.shortTermLiabilities[0]?.coa_account_type,
                    // )}
                  />
                </div>
                <hr />
                <div className='flex justify-between'>
                  <p className='font-bold text-black'>
                    Jumlah Kewajiban Jangka Pendek{' '}
                  </p>
                  <p className='text-black'>
                    {renderLargaData(
                      balanceSheetData?.totalShortTermLiabilities,
                    )}
                  </p>
                </div>
              </div>
              <div className='ml-3 flex flex-col gap-2'>
                <p className='font-bold text-black'>
                  LIABILITAS JANGKA PANJANG
                </p>
                <MapData
                  title='Liabilitas Jangka Panjang'
                  data={balanceSheetData?.longTermLiabilities}
                  // toDetail={routeToDetail(
                  //   balanceSheet?.longTermLiabilities[0]?.coa_account_type,
                  // )}
                />
              </div>
              <hr />
              <div className='flex justify-between'>
                <p className='font-bold text-black'>Jumlah Kewajiban</p>
                <p className='text-black'>
                  {renderLargaData(balanceSheetData?.totalLiabilities)}
                </p>
              </div>
            </div>
            <div className='ml-3 flex flex-col gap-2'>
              <p className='font-bold text-black'>EKUITAS</p>
              <MapData
                title='Ekuitas'
                data={balanceSheetData?.modals}
                // toDetail={routeToDetail(
                //   balanceSheet?.modals[0]?.coa_account_type,
                // )}
              />
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='font-bold text-black'>
                JUMLAH LIABILITAS DAN EKUITAS
              </p>
              <p className='font-bold text-black'>
                {renderLargaData(balanceSheetData?.totalEquityAndLiability)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionComponent;
