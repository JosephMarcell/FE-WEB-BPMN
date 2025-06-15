import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { writeCurrency } from '@/lib/money';

import { useCountWhiteCollarWitholdCertificateByPkid } from '@/app/api/hooks/hrm/white_collar_withold_certificate/useCountWhiteCollarWitholdCertificateByPkid';
import { useGetWhiteCollarWitholdCertificateByPkid } from '@/app/api/hooks/hrm/white_collar_withold_certificate/useGetWhiteCollarWitholdCertificateByPkid';
import { useUpdateWhiteCollarWitholdCertificate } from '@/app/api/hooks/hrm/white_collar_withold_certificate/useUpdateWhiteCollarWitholdCertificate';
import {
  BukpotWhiteResult,
  bukpotWhiteResultInitialState,
  WhiteCollarWitholdCertificateProperty,
} from '@/helpers/utils/hrm/white_collar_withold_certificate';

interface IBukpotDetailProps {
  pkid: number;
}

const WhiteCollarWitholdCertificate = ({ pkid }: IBukpotDetailProps) => {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<BukpotWhiteResult>(
    bukpotWhiteResultInitialState,
  );

  const { data: bukpotData } = useGetWhiteCollarWitholdCertificateByPkid(pkid);
  const {
    data: countBukpot,
    refetch,
    isFetching,
  } = useCountWhiteCollarWitholdCertificateByPkid(
    result.data?.ptkp_id || 0,
    Number(result.data?.neto_sebelum) +
      Number(result.count.bukpotOutput?.penghasilan_netto),
  );
  const updateMutation = useUpdateWhiteCollarWitholdCertificate();

  useEffect(() => {
    if (bukpotData != undefined) {
      setResult(bukpotData.data);
    }
  }, [bukpotData]);

  useEffect(() => {
    if (result) {
      refetch();
    }
  }, [result, refetch]);

  useEffect(() => {
    if (countBukpot !== undefined) {
      setResult(currentResult => ({
        ...currentResult,
        count: {
          ...currentResult.count,
          nettoOutput: countBukpot.nettoOutput,
        },
      }));
    }
  }, [countBukpot]);

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handleNo14Change = (value: number) => {
    if (result.data) {
      setResult({
        ...result,
        data: {
          ...result.data,
          neto_sebelum: value,
        },
      });
    }
  };

  const handleNo19Change = (value: number) => {
    if (result.data) {
      setResult({
        ...result,
        data: {
          ...result.data,
          pajak_telah_dipotong: value,
        },
      });
    }
  };

  const handlePemotongChange = (value: string) => {
    if (result.data) {
      setResult({
        ...result,
        data: {
          ...result.data,
          pemotong: value,
        },
      });
    }
  };

  const handleSave = async (updateStatus = false) => {
    setIsSaving(true);

    if (result.data) {
      const updateData: WhiteCollarWitholdCertificateProperty = {
        ...result.data,
        gaji: Number(result.count.bukpotOutput?.gaji),
        tunjangan_pph: Number(result.count.bukpotOutput?.tunjangan_pph),
        tunjangan_lain: Number(
          result.count.bukpotOutput?.tunjangan_lain_uang_lembur,
        ),
        honorarium_imbalan: Number(result.count.bukpotOutput?.honorarium),
        premi_asuransi: Number(
          result.count.bukpotOutput?.asuransi_diberi_pekerja,
        ),
        natura: Number(result.count.bukpotOutput?.natura),
        gratifikasi_thr: Number(result.count.bukpotOutput?.bonus),
        biaya_jabatan_pensiun: Number(result.count.bukpotOutput?.biaya_jabatan),
        iuran_pensiun: Number(
          result.count.bukpotOutput?.iuran_pensiun_asuransi_sendiri,
        ),
        neto_sebelum: Number(result.data?.neto_sebelum),
        pajak: Number(result.count.nettoOutput?.yearly_pph21),
        pajak_telah_dipotong: Number(result.data?.pajak_telah_dipotong),
        pajak_lunas: Number(result.data?.pajak_telah_dipotong),
        status: updateStatus ? 'Verified' : 'Not Verified',
      };

      try {
        await updateMutation.mutateAsync({
          pkid: pkid,
          data: updateData,
        });

        Swal.fire({
          title: 'Success',
          text: updateStatus
            ? 'Bukti potong telah diverifikasi.'
            : 'Bukti potong telah disimpan.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          router.back();
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error saving the data.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }

    setIsSaving(false);
  };

  return (
    <div>
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
      {bukpotData != undefined ? (
        <div className='mb-4 rounded border bg-white p-4 shadow-lg'>
          <h1 className='mb-4 text-2xl font-bold'>Bukti Potong</h1>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-1 rounded border bg-gray-50 p-4'>
              <h2 className='mb-2 text-lg font-bold'>Profil Pegawai</h2>
              <p>Nama: {result.data?.Employee?.fullname}</p>
              <p>NIP: {result.data?.Employee?.nip}</p>
              <p>Tahun: {result.data?.year}</p>
              <p>Status Bukti Potong: {result.data?.status}</p>
            </div>
            <div className='rounded border bg-gray-50 p-4'>
              <h2 className='mb-2 text-lg font-bold'>Pemotong</h2>
              <input
                value={result.data?.pemotong ?? ''}
                onChange={e => handlePemotongChange(e.target.value)}
                type='text'
                className='h-10 w-full rounded-md border border-gray-300 text-sm'
                disabled={
                  result.data?.pemotong === 'Verified' ||
                  bukpotData?.headers['can_update'] !== 'true'
                }
              />
            </div>
          </div>
          <div className='mt-4 space-y-1 rounded border bg-gray-50 p-4'>
            <h2 className='mb-2 text-lg font-bold'>Penghasilan Bruto</h2>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>1.</div>
                <div>GAJI/PENSIUN ATAU THT/JHT</div>
              </div>
              <div>
                {handleWriteCurrency(result.count.bukpotOutput?.gaji || 0)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>2.</div>
                <div>TUNJANGAN PPh</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.tunjangan_pph || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>3.</div>
                <div>TUNJANGAN LAINNYA, UANG LEMBUR DAN SEBAGAINYA</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.tunjangan_lain_uang_lembur || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>4.</div>
                <div>HONORARIUM DAN IMBALAN LAIN SEJENISNYA</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.honorarium || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>5.</div>
                <div>PREMI ASURANSI YANG DIBAYAR PEMBERI KERJA</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.asuransi_diberi_pekerja || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>6.</div>
                <div>
                  PENERIMAAN DALAM BENTUK NATURA DAN KENIKMATAN LAINNYA YANG
                  DIKENAKAN PEMOTONGAN PPh PASAL 21
                </div>
              </div>
              <div>
                {handleWriteCurrency(result.count.bukpotOutput?.natura || 0)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>7.</div>
                <div>TANTIEM, BONUS, GRATIFIKASI, JASA PRODUKSI DAN THR</div>
              </div>
              <div>
                {handleWriteCurrency(result.count.bukpotOutput?.bonus || 0)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>8.</div>
                <div>JUMLAH PENGHASILAN BRUTO</div>
              </div>
              <div>
                {handleWriteCurrency(
                  Number(result.count.bukpotOutput?.gaji) +
                    Number(result.count.bukpotOutput?.tunjangan_pph) +
                    Number(
                      result.count.bukpotOutput?.tunjangan_lain_uang_lembur,
                    ) +
                    Number(result.count.bukpotOutput?.honorarium) +
                    Number(result.count.bukpotOutput?.asuransi_diberi_pekerja) +
                    Number(result.count.bukpotOutput?.natura) +
                    Number(result.count.bukpotOutput?.bonus) || 0,
                )}
              </div>
            </div>
          </div>
          <div className='mt-4 space-y-1 rounded border bg-gray-50 p-4'>
            <h2 className='mb-2 text-lg font-bold'>Pengurangan</h2>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>9.</div>
                <div>BIAYA JABATAN/BIAYA PENSIUN</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.biaya_jabatan || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>10.</div>
                <div>IURAN PENSIUN ATAU IURAN THT/JHT</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.iuran_pensiun_asuransi_sendiri ||
                    0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>11.</div>
                <div>PEMBAYARAN ZAKAT/AMAL</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.amal_amount || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>12.</div>
                <div>JUMLAH PENGURANGAN</div>
              </div>
              <div>
                {handleWriteCurrency(
                  Number(result.count.bukpotOutput?.biaya_jabatan) +
                    Number(
                      result.count.bukpotOutput?.iuran_pensiun_asuransi_sendiri,
                    ) +
                    Number(result.count.bukpotOutput?.amal_amount),
                )}
              </div>
            </div>
          </div>
          <div className='mt-4 space-y-1 rounded border bg-gray-50 p-4'>
            <h2 className='mb-2 text-lg font-bold'>Perhitungan PPh Pasal 21</h2>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>13.</div>
                <div>JUMLAH PENGHASILAN NETO</div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.bukpotOutput?.penghasilan_netto || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center'>
                <div className='w-6'>14.</div>
                <div>PENGHASILAN NETO MASA SEBELUMNYA</div>
              </div>
              <input
                type='number'
                value={Number(result.data?.neto_sebelum)}
                onChange={e => handleNo14Change(Number(e.target.value))}
                className='ml-2 rounded border border-gray-300 p-1'
                disabled={
                  result.data?.status === 'Verified' ||
                  bukpotData?.headers['can_update'] !== 'true'
                }
              />
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>15.</div>
                <div>
                  JUMLAH PENGHASILAN NETO UNTUK PENGHITUNGAN PPh PASAL 21
                </div>
              </div>
              <div>
                {handleWriteCurrency(
                  Number(result.count.bukpotOutput?.penghasilan_netto) +
                    Number(result.data?.neto_sebelum),
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>16.</div>
                <div>PENGHASILAN TIDAK KENA PAJAK (PTKP)</div>
              </div>
              <div>
                {handleWriteCurrency(result.count.bukpotOutput?.ptkp || 0)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>17.</div>
                <div>PENGHASILAN KENA PAJAK SETAHUN/DISETAHUNKAN</div>
              </div>
              <div>
                {handleWriteCurrency(result.count.nettoOutput?.pkp || 0)}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>18.</div>
                <div>
                  PPh PASAL 21 ATAS PENGHASILAN KENA PAJAK SETAHUN/DISETAHUNKAN
                </div>
              </div>
              <div>
                {handleWriteCurrency(
                  result.count.nettoOutput?.yearly_pph21 || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center'>
                <div className='w-6'>19.</div>
                <div>PPh PASAL 21 YANG TELAH DIPOTONG MASA SEBELUMNYA</div>
              </div>
              <input
                type='number'
                value={Number(result.data?.pajak_telah_dipotong)}
                onChange={e => handleNo19Change(Number(e.target.value))}
                className='ml-2 rounded border border-gray-300 p-1'
                disabled={
                  result.data?.status === 'Verified' ||
                  bukpotData?.headers['can_update'] !== 'true'
                }
              />
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>20.</div>
                <div>PPh PASAL 21 TERUTANG</div>
              </div>
              <div>
                {handleWriteCurrency(
                  Number(result.count.nettoOutput?.yearly_pph21) -
                    Number(result.data?.pajak_telah_dipotong) || 0,
                )}
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>21.</div>
                <div>
                  PPh PASAL 21 DAN PPh PASAL 26 YANG TELAH DIPOTONG DAN DILUNASI
                </div>
              </div>
              <div>
                {handleWriteCurrency(
                  Number(result.count.nettoOutput?.yearly_pph21) -
                    Number(result.data?.pajak_telah_dipotong) || 0,
                )}
              </div>
            </div>
          </div>
          {bukpotData?.headers['can_update'] === 'true' &&
            result.data?.status !== 'Verified' && (
              <div className='mt-4 flex space-x-2'>
                <button
                  className='rounded-lg bg-blue-500 px-4 py-2 text-white'
                  onClick={() => handleSave()}
                  disabled={isSaving}
                >
                  Simpan
                </button>
                <button
                  className='rounded-lg bg-green-500 px-4 py-2 text-white'
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  Simpan & Rekap
                </button>
              </div>
            )}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default WhiteCollarWitholdCertificate;
