import { useSelector } from 'react-redux';

import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';

import { IRootState } from '@/store';

import { renderLargaData } from '@/helpers/utils/general_ledger/dataProcessing';

interface ActionComponentProps {
  title?: string;
}
interface NameValueProps {
  name: string;
  value: number;
}
const ActionComponent = ({ title }: ActionComponentProps) => {
  const incomeStatementData = useSelector(
    (state: IRootState) => state.incomeStatements.incomeStatementData,
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
                  Laba Rugi
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
                  {`${incomeStatementData.periods.start_date ?? '-'} sd ${
                    incomeStatementData.periods.end_date ?? '-'
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
          {/* Pendapatan Section */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>Pendapatan</p>
            <div className='flex justify-between'>
              <p className='text-black'>Pendapatan Penjualan</p>
              <p className='text-black'>
                {/* {(
                  parseInt(incomeStatement.salesInvoice.total) | 0
                ).toLocaleString('id-ID')} */}
                {renderLargaData(incomeStatementData.pendapatan)}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='text-black'>Total Pendapatan</p>
              <p className='text-black'>
                {/* {(
                  parseInt(incomeStatement.salesInvoice.total) | 0
                ).toLocaleString('id-ID')} */}
                {renderLargaData(incomeStatementData.pendapatan)}
              </p>
            </div>
          </div>
          {/* Beban Pokok Pendapatan Section */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>Beban Pokok Pendapatan</p>
            <div className='flex justify-between'>
              <p className='text-black'>Beban Pokok Penjualan</p>
              <p className='text-black'>
                {/* {(parseInt(incomeStatement.hppValue) | 0).toLocaleString(
                  'id-ID',
                )} */}
                {renderLargaData(incomeStatementData.totalBebanPokokPenjualan)}
              </p>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='text-black'>Laba Kotor</p>
              <p className='text-black'>
                {/* {getLabaKotor().toLocaleString('id-ID')} */}
                {renderLargaData(incomeStatementData.labaKotor)}
              </p>
            </div>
          </div>
          {/* Beban Operasional Section */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>Beban Operasional</p>
            <div className='flex w-full flex-col p-2'>
              {incomeStatementData.listBebanOperational.length > 0 &&
                incomeStatementData.listBebanOperational.map(
                  (item: NameValueProps, index: number) => {
                    return (
                      <div key={index} className='flex w-full justify-between'>
                        <p>{item.name}</p>
                        <p>{renderLargaData(item.value)}</p>
                      </div>
                    );
                  },
                )}
            </div>
            <div className='flex justify-between'>
              <p className='font-bold text-black'>Total Beban Operasional</p>
              <p className='text-black'>
                {renderLargaData(incomeStatementData.totalBebanOperasional)}
              </p>
            </div>

            <hr />
            <div className='flex justify-between'>
              <p className='text-black'>Pendapatan Operasional</p>
              <p className='text-black'>
                {/* {getLabaOperasional().toLocaleString('id-ID')} */}
                {renderLargaData(incomeStatementData.pendapatanOperasional)}
              </p>
            </div>
          </div>
          {/* Beban Non Operasional Section */}
          <div className='flex flex-col gap-2'>
            <p className='font-bold'> PENDAPATAN DAN BEBAN NON OPERASIONAL</p>
            <div className='flex flex-col gap-2'>
              <p className='font-bold'> Pendapatan Non Operasional</p>
              <div className='flex justify-between'>
                <p className='text-black'>Jumlah Pendapatan Non Operasional</p>
                <p className='text-black'>
                  {renderLargaData(
                    incomeStatementData.pendapatanNonOperasional,
                  )}
                </p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-bold'> Beban Non Operasional</p>
              <div className='flex justify-between'>
                <p className='text-black'>Jumlah Beban Non Operasional</p>
                <p className='text-black'>
                  {renderLargaData(
                    incomeStatementData.pendapatanNonOperasional,
                  )}
                </p>
              </div>
            </div>
            <hr />
            <div className='flex justify-between'>
              <p className='text-black'>
                Jumlah Pendapatan dan Beban Non Operasional
              </p>
              <p className='text-black'>
                {renderLargaData(
                  incomeStatementData.totalPendapatanNonOperasionaldanBebanNonOperasional,
                )}
              </p>
            </div>
          </div>

          {/* Laba Sebelum Pajak Section */}

          {/* Pajak Section */}

          {/* Laba Setelah Pajak */}

          {/* Laba Bersih */}
          <div className='mt-2 flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p className='font-bold text-black'>Laba Bersih</p>
              <p className='text-black'>
                {renderLargaData(incomeStatementData.labaBersih)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionComponent;
