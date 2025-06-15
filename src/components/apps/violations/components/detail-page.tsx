import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import EditModals from '@/components/apps/violations/components/modal-edit';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetUserDetail } from '@/app/api/hooks/user_management/user/useGetUserDetail';
import { useDeleteMedia } from '@/app/api/hooks/violations/useDeleteMedia'; // Import the hook
import { useSoftDeleteViolation } from '@/app/api/hooks/violations/useSoftDeleteViolation';
import {
  getMediaProps,
  getSeverityClass,
  getStatusClass,
  getViolationDeatilProps,
} from '@/helpers/utils/violations/violation';

const { t } = getTranslation();

interface IViolationDetail {
  data: getViolationDeatilProps;
  media: getMediaProps[];
}
const DetailViolation = ({ data, media }: IViolationDetail) => {
  const reportedName = useGetUserDetail(String(data.reported_by_pkid));
  const statusClass = getStatusClass(data.status);
  const severityClass = getSeverityClass(data.severity);
  const { mutateAsync: deleteViolation } = useSoftDeleteViolation();
  const { mutateAsync: deleteMedia } = useDeleteMedia(); // Use the hook
  const router = useRouter();
  const handleDeleteViolation = async () => {
    Swal.fire({
      title: t('are_you_sure'),
      text: t('not_saved'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes_continue'),
      cancelButtonText: t('no_cancel'),
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteViolation(data.pkid);
          router.push('/violations');
        } catch (error) {
          Swal.fire('Error!', t('error_occurred'), 'error');
        }
      }
    });
  };
  const handleDeleteMedia = async (mediaId: number) => {
    Swal.fire({
      title: t('are_you_sure'),
      text: t('not_saved'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes_continue'),
      cancelButtonText: t('no_cancel'),
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteMedia({ pkid: data.pkid, mediaIds: [mediaId] });
          Swal.fire('Deleted!', t('media_deleted'), 'success');
          window.location.reload();
        } catch (error) {
          Swal.fire('Error!', t('error_occurred'), 'error');
        }
      }
    });
  };
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const [locationName, setLocationName] = React.useState('');
  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_API_GOOGLE_API_KEY}`,
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Error fetching location';
    }
  };
  useEffect(() => {
    fetchLocationName(data.latitude, data.longitude).then(setLocationName);
  }, [data.latitude, data.longitude]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.description]); // Adjust on content changes
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-3xl font-bold'> {data.report_title} </h3>
          <div className='flex gap-3'>
            <button
              type='button'
              className='btn btn-warning'
              onClick={() => dispatch(setModalForm(true))}
            >
              {t('edit')}
            </button>
            <Link href='/violations'>
              <button type='button' className='btn btn-primary'>
                {t('back')}
              </button>
            </Link>
          </div>
        </div>
        <EditModals
          modal={modalForm}
          setModal={handleSetModal}
          violationData={data}
        />
        <div className='space-y-5'>
          <div className='flex flex-row gap-4'>
            <div>
              <label>{t('status')}</label>
              <p
                className={`min-w-20 rounded-xl px-4 py-2 text-center capitalize ${statusClass}`}
              >
                {data.status ? data.status : '-'}
              </p>
            </div>
            <div>
              <label>{t('severity')}</label>
              <p
                className={`min-w-20 rounded-xl px-4 py-2 text-center capitalize ${severityClass}`}
              >
                {data.severity}
              </p>
            </div>
          </div>
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex flex-1 flex-col '>
              <label>{t('location_name')}</label>
              <input
                id='location'
                name='location'
                type='text'
                className='form-input'
                value={locationName}
                disabled
              />
            </div>
            <div className='flex flex-1 flex-col '>
              <label>{t('latitude')}</label>
              <input
                id='latitude'
                name='latitude'
                type='text'
                className='form-input'
                value={data.latitude}
                disabled
              />
            </div>

            <div className='flex flex-1 flex-col '>
              <label>{t('longitude')}</label>
              <input
                id='longitude'
                name='longitude'
                type='text'
                className='form-input'
                value={data.longitude}
                disabled
              />
            </div>
          </div>
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex flex-1 flex-col '>
              <label>{t('reporter')}</label>
              <input
                id='username'
                name='username'
                type='text'
                className='form-input'
                value={reportedName.data?.username || data.reported_by_pkid}
                disabled
              />
            </div>
            <div className='flex flex-1 flex-col '>
              <label>{t('violation_type')}</label>
              <input
                id='violation_type'
                name='violation_type'
                type='text'
                className='form-input'
                value={data.violation_type}
                disabled
              />
            </div>
            <div className='flex flex-1 flex-col '>
              <label>{t('reported_at')}</label>
              <input
                id='reported_at'
                name='reported_at'
                type='text'
                className='form-input'
                value={new Date(data.reported_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                disabled
              />
            </div>
          </div>
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex flex-1 flex-col'>
              <label>{t('description')}</label>
              <textarea
                id='description'
                name='description'
                className='form-input'
                value={data.description}
                disabled
                ref={textareaRef}
                style={{ height: 'auto', minHeight: '100px', resize: 'none' }}
                rows={1}
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <label>{t('evidence')}</label>
            <div className='flex flex-wrap gap-2'>
              {media && media.length > 0 ? (
                media.map((item: getMediaProps, index: number) => (
                  <div key={index} className='relative h-40 w-40'>
                    <div
                      className='cursor-pointer overflow-hidden rounded-xl shadow-md'
                      onClick={() => {
                        Swal.fire({
                          imageUrl: item.media_url,
                          imageAlt: 'Violation Evidence',
                          showConfirmButton: false,
                          customClass: {
                            image: 'w-full h-full object-cover m-0',
                          },
                        });
                      }}
                    >
                      <Image
                        src={item.media_url}
                        alt='Violation Evidence'
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                    <button
                      className='absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white'
                      onClick={() => handleDeleteMedia(item.pkid)} // Pass the correct media ID
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p>{t('no_evidence_uploaded')}</p>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            type='button'
            className='btn btn-danger'
            onClick={handleDeleteViolation}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailViolation;
