import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { writeCurrency } from '@/lib/money';

import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetBlueCollarWitholdCertificateByPkid } from '@/app/api/hooks/hrm/blue_collar_withold_certificate/useGetBlueCollarWitholdCertificateByPkid';
import { useUpdateBlueCollarWitholdCertificate } from '@/app/api/hooks/hrm/blue_collar_withold_certificate/useUpdateBlueCollarWitholdCertificate';
import {
  blueCollarWitholdCertificateInitialState,
  BlueCollarWitholdCertificateProperty,
} from '@/helpers/utils/hrm/blue_collar_withold_certificate';

interface BukpotDetailProps {
  pkid: number;
}

const BlueCollarWitholdCertificate = ({ pkid }: BukpotDetailProps) => {
  const router = useRouter();

  const { data: bukpotData } = useGetBlueCollarWitholdCertificateByPkid(pkid);
  const updateMutation = useUpdateBlueCollarWitholdCertificate();

  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<BlueCollarWitholdCertificateProperty>(
    blueCollarWitholdCertificateInitialState,
  );

  useEffect(() => {
    if (bukpotData != undefined) {
      setResult(bukpotData.data);
    }
  }, [bukpotData]);

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handlePemotongChange = (value: string) => {
    setResult({
      ...result,
      pemotong: value,
    });
  };

  const handleSave = async (updateStatus = false) => {
    setIsSaving(true);

    const updateData: BlueCollarWitholdCertificateProperty = {
      ...result,
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
        router.back(); // Redirect to the previous page after the alert is closed
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'There was an error saving the data.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    setIsSaving(false);
  };

  return (
    <div>
      {bukpotData != undefined ? (
        <div className='mb-4 rounded border bg-white p-4 shadow-lg'>
          <h1 className='mb-4 text-2xl font-bold'>Bukti Potong</h1>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-1 rounded border bg-gray-50 p-4'>
              <h2 className='mb-2 text-lg font-bold'>Profil Pegawai</h2>
              <p>Nama: {result.Employee?.fullname}</p>
              <p>NIP: {result.Employee?.nip}</p>
              <p>Month: {result.month}</p>
              <p>Tahun: {result.year}</p>
              <p>Status Bukti Potong: {result.status}</p>
            </div>
            <div className='rounded border bg-gray-50 p-4'>
              <h2 className='text-lg font-bold'>Pemotong</h2>
              <input
                value={result.pemotong ?? ''}
                onChange={e => handlePemotongChange(e.target.value)}
                type='text'
                className='h-10 w-full rounded-md border border-gray-300 text-sm'
                disabled={
                  result.pemotong === 'Verified' ||
                  bukpotData?.headers['can_update'] !== 'true'
                }
              />
            </div>
          </div>
          <div className='mt-4 space-y-1 rounded border bg-gray-50 p-4'>
            <h2 className='mb-2 text-lg font-bold'>
              PPh PASAL 21 DAN/ATAU PASAL 26 YANG DIPOTONG
            </h2>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>1.</div>
                <div>JUMLAH PENGHASILAN BRUTO</div>
              </div>
              <div>{handleWriteCurrency(result.penghasilan_bruto || 0)}</div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>2.</div>
                <div>TARIF</div>
              </div>
              <div>
                {result.tarif?.toLocaleString('id-ID', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex'>
                <div className='w-6'>3.</div>
                <div>PPh DIPOTONG</div>
              </div>
              <div>{handleWriteCurrency(result.pph_dipotong || 0)}</div>
            </div>
          </div>
          {bukpotData?.headers['can_update'] === 'true' && (
            <div className='mb-2 mt-5 flex space-x-2'>
              <button
                className='btn btn-primary'
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                Simpan
              </button>
              <button
                className='btn btn-success'
                onClick={() => handleSave(true)}
                disabled={isSaving}
              >
                Simpan & Rekap
              </button>
            </div>
          )}
        </div>
      ) : (
        <LoadingDetailPage />
      )}
    </div>
  );
};

export default BlueCollarWitholdCertificate;
