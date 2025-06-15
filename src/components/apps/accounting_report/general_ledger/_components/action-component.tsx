import { useSelector } from 'react-redux';

import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';

import { IRootState } from '@/store';

interface ActionComponentProps {
  title?: string;
}
interface ItemChild {
  date: string;
  debit: number | null;
  credit: number | null;
  transactionType: string;
  description: string;
  balance: number;
}
interface Item {
  coa_name: string;
  coa_number: string;
  data: Array<ItemChild>;
  total: number;
}
const ActionComponent = ({ title }: ActionComponentProps) => {
  const generalLedgerData = useSelector(
    (state: IRootState) => state.generalLedger.generalLedgerData,
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
                  Laporan Buku Besar
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
                  {/* Per Tgl {endDateString ? formatDate(endDateString) : '-'} */}
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
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Tanggal
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Tipe Transaksi
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Keterangan
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Debit
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Kredit
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Saldo Akhir
                  </th>
                </tr>
              </thead>
              <tbody>
                {generalLedgerData.map((item: Item, index: number) => {
                  const totalDebit = item.data.reduce(
                    (a: number, b: ItemChild) => a + (b.debit ?? 0),
                    0,
                  );
                  const totalCredit = item.data.reduce(
                    (a: number, b: ItemChild) => a + (b.credit ?? 0),
                    0,
                  );
                  return (
                    <>
                      <tr key={index} className='border-b bg-white '>
                        <th
                          scope='row'
                          colSpan={6}
                          className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                        >
                          <h4 className='font-bold'>{`${item.coa_number} - ${item.coa_name}`}</h4>
                        </th>
                      </tr>
                      {item?.data.map((item2: ItemChild, index2: number) => {
                        return (
                          <tr key={index2} className='border-b bg-white '>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                            >
                              &nbsp;&nbsp;&nbsp;{String(item2.date)}
                            </th>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                            >
                              {item2.transactionType}
                            </th>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                            >
                              {item2.description}
                            </th>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                            >
                              {item2.debit?.toLocaleString('id-ID')}
                            </th>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                            >
                              {item2.credit?.toLocaleString('id-ID')}
                            </th>
                            <th
                              scope='row'
                              className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                            >
                              {item2.balance?.toLocaleString('id-ID')}
                            </th>
                          </tr>
                        );
                      })}
                      <tr key={index} className='border-b bg-white '>
                        <th
                          scope='row'
                          colSpan={3}
                          className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                        >
                          <h4>&nbsp;&nbsp;&nbsp;Total</h4>
                        </th>
                        <th
                          scope='row'
                          className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                        >
                          {totalDebit?.toLocaleString('id-ID')}
                        </th>
                        <th
                          scope='row'
                          className='whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900'
                        >
                          {totalCredit?.toLocaleString('id-ID')}
                        </th>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionComponent;
