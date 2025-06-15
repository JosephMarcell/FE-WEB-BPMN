import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconX from '@/components/icon/icon-x';

import { useGetAllUserDropdown } from '@/app/api/hooks/user_management/user/useGetAllUserDropdown';
import { useCreateMediaViolation as CreateMedia } from '@/app/api/hooks/violations/useCreateMediaViolation';
import { useUpdateViolation } from '@/app/api/hooks/violations/useUpdateViolation';
import {
  severityTypes,
  updateViolationProps,
  ViolationStatus,
  violationTypes,
} from '@/helpers/utils/violations/violation';
import {
  ViolationSeverity,
  ViolationType,
} from '@/helpers/utils/violations/violation';

const { t } = getTranslation();

interface IModalEditProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  violationData: updateViolationProps;
}
const DefaultZoom = 7;

const EditModals = ({ modal, setModal, violationData }: IModalEditProps) => {
  const { data: getAllUser = [] } = useGetAllUserDropdown();
  const { mutate: updateViolation } = useUpdateViolation();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [location, setLocation] = useState({
    lat: violationData.latitude,
    lng: violationData.longitude,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [formData, setFormData] = useState({
    report_title: violationData.report_title,
    latitude: violationData.latitude,
    longitude: violationData.longitude,
    reported_at: violationData.reported_at
      ? new Date(violationData.reported_at).toISOString().split('T')[0]
      : '',
    reported_by_pkid: violationData.reported_by_pkid || undefined,
    violation_type: violationData.violation_type || undefined,
    severity: violationData.severity || undefined,
    desc: violationData.description || '',
    violationEvidence: null,
  });
  const initializeMap = React.useCallback(() => {
    if (mapRef.current && window.google && window.google.maps) {
      // Ensure previous instances are cleared
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Create new map instance
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: violationData.latitude, lng: violationData.longitude },
        zoom: DefaultZoom,
      });

      // Create new marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat: violationData.latitude, lng: violationData.longitude },
        map: mapInstanceRef.current,
        draggable: true,
      });

      // Add dragend listener to the marker
      window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          setLocation({ lat: newLat, lng: newLng });
          setFormData(prev => ({
            ...prev,
            latitude: newLat,
            longitude: newLng,
          }));
        }
        const mapInstance = markerRef.current?.getMap();
        const zoom = mapInstance?.getZoom();
        if (zoom !== undefined) {
          handleChangeZoom(zoom);
        }
      });
    }
  }, [violationData.latitude, violationData.longitude]);

  const refreshMap = React.useCallback(() => {
    if (mapRef.current && window.google && window.google.maps) {
      // Ensure previous instances are cleared
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Create new map instance
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: -7.2586, lng: 112.7485 },
        zoom: zoom,
      });

      const currentLocation = markerRef.current?.getPosition();
      markerRef.current = new window.google.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        draggable: true,
      });

      // Add dragend listener to the marker
      window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          setLocation({ lat: newLat, lng: newLng });
          setFormData(prev => ({
            ...prev,
            latitude: newLat,
            longitude: newLng,
          }));
        }
        const mapInstance = markerRef.current?.getMap();
        const zoom = mapInstance?.getZoom();
        if (zoom !== undefined) {
          handleChangeZoom(zoom);
        }
      });
    }
  }, [zoom]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    if (modal) {
      loadGoogleMapsScript();
    } else {
      setFormData(prev => ({
        ...prev,
        latitude: violationData.latitude,
        longitude: violationData.longitude,
      }));
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [modal, initializeMap, violationData.latitude, violationData.longitude]);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length > 5) {
        Swal.fire({
          icon: 'error',
          title: t('fail'),
          text: t('max_5'),
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: t('success'),
        text: t('file_uploaded'),
      });
      setSelectedFiles(Array.from(files));
    }
  };
  const handleChangeZoom = (zoom: number) => setZoom(zoom);
  const handleSubmit = async () => {
    const payload: updateViolationProps = {
      report_title: formData.report_title,
      reported_by_pkid: Number(formData.reported_by_pkid),
      pkid: violationData.pkid,
      latitude: location.lat,
      longitude: location.lng,
      reported_at: new Date(formData.reported_at).toISOString(),
      violation_type: formData.violation_type as ViolationType,
      status: violationData.status as ViolationStatus,
      severity: formData.severity as ViolationSeverity,
      description: formData.desc,
    };
    try {
      if (selectedFiles) {
        await CreateMedia(selectedFiles, violationData.pkid);
      }
      updateViolation(
        { pkid: payload.pkid, data: payload },
        {
          onSuccess: () => {
            handleClose();
            setZoom(zoom);
            queryClient.invalidateQueries();
            Swal.fire({
              icon: 'success',
              title: t('success'),
              text: t('data_updated'),
            });
          },
          onError: error => {
            Swal.fire({
              icon: 'error',
              title: t('fail'),
              text: t('failed_to_update') + `: ${error.message}`,
            });
          },
        },
      );
      Swal.fire({
        icon: 'success',
        title: t('success'),
        text: t('data_updated'),
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('fail'),
        text: t('failed_to_update'),
      });
    }
  };
  const handleClose = () => {
    setModal(false);
    setFormData({
      report_title: violationData.report_title,
      latitude: violationData.latitude,
      longitude: violationData.longitude,
      reported_at: violationData.reported_at
        ? new Date(violationData.reported_at).toISOString().split('T')[0]
        : '',
      reported_by_pkid: violationData.reported_by_pkid || undefined,
      violation_type: violationData.violation_type || undefined,
      severity: violationData.severity || undefined,
      desc: violationData.description || '',
      violationEvidence: null,
    });
  };
  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0' />
        </Transition.Child>
        <div
          id='slideIn_down_modal'
          className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  {' '}
                  {t('edit')} {t('violations')}{' '}
                </h5>
                <button
                  onClick={handleClose}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5'>
                <div className='space-y-5'>
                  <div className='w-full'>
                    <div
                      id='map'
                      ref={mapRef}
                      className='rounded-lg bg-white dark:bg-black'
                      style={{ height: '365px', width: '100%' }}
                    />
                    <button
                      onClick={refreshMap}
                      className='btn btn-outline-primary my-4x'
                    >
                      {' '}
                      {t('reload_map')}{' '}
                    </button>
                  </div>
                  <div className='flex w-full flex-col'>
                    <label htmlFor='report_title'>
                      {t('report_title')}{' '}
                      <span className='text-red-600'>*</span>
                    </label>
                    <input
                      id='report_title'
                      name='report_title'
                      type='text'
                      className='form-input'
                      value={formData.report_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='flex w-full gap-7'>
                    <div className='w-full'>
                      <label htmlFor='latitude'>
                        {t('latitude')} <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='latitude'
                        name='latitude'
                        type='text'
                        className='form-input'
                        value={location.lat}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='w-full'>
                      <label htmlFor='longitude'>
                        {t('longitude')} <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='longitude'
                        name='longitude'
                        type='text'
                        className='form-input'
                        value={location.lng}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='w-full'>
                      <label htmlFor='reported_at'>
                        {t('reported_at')}{' '}
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='reported_at'
                        name='reported_at'
                        type='date'
                        className='form-input'
                        value={formData.reported_at}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className='flex w-full gap-7'>
                    <div className='w-full'>
                      <label htmlFor='reported_by_pkid'>
                        {t('reporter')} <span className='text-red-600'>*</span>
                      </label>
                      <select
                        id='reported_by_pkid'
                        name='reported_by_pkid'
                        className='form-input'
                        value={formData.reported_by_pkid}
                        onChange={handleInputChange}
                      >
                        <option value='' disabled selected>
                          {t('select_reporter')}
                        </option>
                        {getAllUser.map(
                          (user: { pkid: number; username: string }) => (
                            <option key={user.pkid} value={user.pkid}>
                              {user.username}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div className='w-full'>
                      <label htmlFor='violation_type'>
                        {t('violation_type')}{' '}
                        <span className='text-red-600'>*</span>
                      </label>
                      <select
                        id='violation_type'
                        name='violation_type'
                        className='form-input'
                        value={formData.violation_type}
                        onChange={handleInputChange}
                      >
                        <option value='' disabled selected>
                          {t('select_violation_type')}
                        </option>
                        {Object.entries(violationTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='w-full'>
                      <label htmlFor='severity'>
                        {t('severity')} <span className='text-red-600'>*</span>
                      </label>

                      <select
                        id='severity'
                        name='severity'
                        className='form-input'
                        value={formData.severity}
                        onChange={handleInputChange}
                      >
                        <option value='' disabled selected>
                          {t('select_severity')}
                        </option>
                        {Object.entries(severityTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='flex flex-row justify-between gap-4'>
                    <div className='flex flex-1 flex-col '>
                      <label> {t('description')} </label>
                      <textarea
                        id='desc'
                        name='desc'
                        className='form-input'
                        value={formData.desc}
                        onChange={handleInputChange}
                        style={{ height: 'auto', minHeight: '100px' }}
                        rows={Math.max(3, formData.desc.split('\n').length)}
                      />
                    </div>
                  </div>
                  <div className='flex w-full gap-7'>
                    <div className='w-full'>
                      <label htmlFor='assetCode'>
                        {t('violation_evidence')}
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='violationEvidence'
                        name='violationEvidence'
                        type='file'
                        accept='.jpg, .jpeg, .png'
                        onChange={handleFileChange}
                        multiple
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                  <button
                    onClick={handleClose}
                    type='button'
                    className='btn btn-outline-danger'
                  >
                    {t('discard')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary ml-4'
                  >
                    {t('save')}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditModals;
