import { useSelector } from 'react-redux';

import IconFile from '@/components/icon/icon-file';
import IconPrinter from '@/components/icon/icon-printer';

import { IRootState } from '@/store';

import { renderLargaData } from '@/helpers/utils/general_ledger/dataProcessing';

interface ActionComponentProps {
  title?: string;
}
interface DepreciationProps {
  coa_pkid: number;
  machine_pkid: string | null;
  name: string;
  price: number;
}
const ActionComponent = ({ title }: ActionComponentProps) => {
  const hppData = useSelector((state: IRootState) => state.hpp.hppData);

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
                  Harga Pokok Produksi
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
                  {`${hppData?.periods?.start_date ?? ''} - ${
                    hppData?.periods?.end_date ?? ''
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
          <tbody>
            <tr className='align-top'>
              <td className='w-[28px]'></td>
              <td className='w-[29px]'></td>
              <td className='w-[250px]'></td>
              <td className='w-[10px]'></td>
              <td className='w-[100px]'></td>
              <td className='w-[10px]'></td>
              <td className='w-[90px]'></td>
              <td className='w-[10px]'></td>
              <td className='w-[40px]'></td>
              <td className='w-[28px]'></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={10}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all border-b border-black pl-5 pr-5 pt-3 text-left'>
                <span className='font-arial text-xs font-bold leading-tight text-blue-900'>
                  Nama
                </span>
              </td>
              <td></td>
              <td className='w-120 whitespace-no-wrap break-all border-b border-black pl-5 pr-5 pt-3 text-right'>
                <span className='font-arial text-xs font-bold leading-tight text-blue-900'>
                  Biaya
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-120 whitespace-no-wrap break-all border-b border-black pl-5 pr-5 pt-3 text-right'
              >
                <span className='font-arial text-xs font-bold leading-tight text-blue-900'>
                  Total Biaya
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-5 align-top'>
              <td colSpan={10}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Bahan Baku Langsung
                </span>
              </td>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
            </tr>
            {/* Detail Bahan Baku Langsung */}
            <tr className='h-[14px] align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Persediaan Awal
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.persediaan_awal)}
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-[14px] align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Pembelian
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  {/* {datas?.pembelian
                      ? formatNumberWithCommas(parseInt(datas.pembelian))
                      : 0} */}
                  {renderLargaData(hppData.pembelian)}
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-[14px] align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Bahan Baku yang Tersedia
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.bahan_baku_tersedia)}
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-[14px] align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Penyesuaian
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.penyesuaian)}
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-[14px] align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Persediaan Akhir
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.persediaan_akhir)}
                </span>
              </td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Bahan Baku yang Langsung Terpakai
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.bahan_baku_langsung_terpakai)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Tenaga Kerja Langsung
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.tenaga_kerja_langsung)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Overhead Manufaktur
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              ></td>
              <td colSpan={2}></td>
            </tr>
            {hppData?.normal_depreciation.length > 0 &&
              hppData?.normal_depreciation.map((machine: DepreciationProps) => (
                <tr className='h-[14px] align-top' key={machine.coa_pkid}>
                  <td colSpan={2}></td>
                  <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-8'>
                    <span className='font-arial text-xs leading-tight text-black'>
                      {machine.name}
                    </span>
                  </td>
                  <td></td>
                  <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'>
                    <span className='font-arial text-xs leading-tight text-black'>
                      {renderLargaData(machine.price)}
                    </span>
                  </td>
                  <td></td>
                  <td
                    colSpan={2}
                    className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
                  ></td>
                  <td colSpan={2}></td>
                </tr>
              ))}

            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Total Overhead Mesin Manufaktur
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.total_overhead_manufaktur)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Biaya Pemeliharaan Mesin
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.pemeliharaan_mesin)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Biaya Listrik
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.biaya_listrik)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Biaya Air
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.biaya_air)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Total Overhead Manufaktur
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.total_overhead_manufaktur)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Total Tambah Biaya Manufaktur
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.total_tambah_biaya_manufaktur)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Ditambah bahan dalam proses awal
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.bahan_dalam_proses_awal)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Ditambah variance bulan ini
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-black'>
                  {renderLargaData(hppData.variance)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Total Biaya Manufaktur
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.total_biaya_manufaktur)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs leading-tight text-black'>
                  Dikurangi barang dalam proses akhir
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all border-b border-black pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs leading-tight text-red-500'>
                  {renderLargaData(hppData.bahan_dalam_proses_akhir)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-6 align-top'>
              <td colSpan={2}></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-left indent-2'>
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  Harga Pokok Produksi
                </span>
              </td>
              <td></td>
              <td className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'></td>
              <td></td>
              <td
                colSpan={2}
                className='w-250 whitespace-no-wrap break-all pr-5 pt-3 text-right indent-2'
              >
                <span className='font-arial text-xs font-bold leading-tight text-black'>
                  {renderLargaData(hppData.harga_pokok_produksi)}
                </span>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr className='h-2 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='w-250 break-all pl-5 pr-5 pt-3 text-left'
              ></td>
              <td></td>
            </tr>
            <tr className='h-2 align-top'>
              <td></td>
              <td
                colSpan={8}
                className='w-250 break-all pl-5 pr-5 pt-3 text-left'
              ></td>
              <td></td>
            </tr>
            <tr className='h-1 align-top'>
              <td></td>
              <td colSpan={8} className='border-t border-black'></td>
              <td></td>
            </tr>
            <tr className='h-3 align-top'>
              <td></td>
              <td
                colSpan={6}
                className='w-539 whitespace-nowrap break-words pl-5 pr-5 pt-3 text-center'
              >
                <span className='font-courier text-xs leading-tight text-black'>
                  ITS ERP System Report
                </span>
              </td>
              <td></td>
            </tr>
            <tr className='h-3 align-top'>
              <td></td>
              <td
                colSpan={6}
                className='w-539 break-words pl-5 pr-5 pt-3 text-left'
              >
                {/* Konten tambahan di sini */}
              </td>
              <td></td>
            </tr>
            <tr className='h-3 align-top'>
              <td></td>
              <td
                colSpan={6}
                className='w-539 whitespace-nowrap break-all pl-5 pr-5 pt-3 text-left'
              >
                <span className='font-courier text-xs leading-tight text-black'>
                  Tercetak pada [Tanggal] - [Jam:Menit]
                </span>
              </td>
              <td></td>
            </tr>
            <tr className='h-7 align-top'>
              <td colSpan={8}></td>
            </tr>
          </tbody>
        </div>
      </div>
    </div>
  );
};

export default ActionComponent;
