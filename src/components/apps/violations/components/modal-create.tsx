import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import IconX from '@/components/icon/icon-x';

import { useGetOffice } from '@/app/api/hooks/user_management/office/useGetOffice';
import { useGetAllUserDropdown } from '@/app/api/hooks/user_management/user/useGetAllUserDropdown';
import { useCreateViolation } from '@/app/api/hooks/violations/useCreateViolations';
import {
  createViolationProps,
  severityTypes,
  violationTypes,
} from '@/helpers/utils/violations/violation';
import {
  ViolationSeverity,
  ViolationType,
} from '@/helpers/utils/violations/violation';

const { t } = getTranslation();

interface IModalCreateProps {
  modal: boolean;
  setModal: (value: boolean) => void;
}

const DefaultLocation = {
  lat: -7.2586, // Latitude of Surabaya
  lng: 112.7485, // Longitude of Surabaya
};
const DefaultZoom = 7;

const CreateModals = ({ modal, setModal }: IModalCreateProps) => {
  const handleClose = () => setModal(false);
  const { data: getAllUser = [] } = useGetAllUserDropdown();
  const { data: officeData = [] } = useGetOffice();
  const { mutate: createViolation } = useCreateViolation();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [formData, setFormData] = useState({
    report_title: '',
    reported_by_pkid: '',
    violation_type: '',
    severity: '',
    desc1: '',
    desc2: '',
    reported_at: '',
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
        center: DefaultLocation,
        zoom: zoom,
      });

      // Create new marker
      markerRef.current = new window.google.maps.Marker({
        position: DefaultLocation,
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
        center: DefaultLocation,
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
    }

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [modal, initializeMap]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeZoom = (zoom: number) => setZoom(zoom);
  const handleSubmit = () => {
    const reported_at = `${formData.reported_at}T00:00:00Z`;
    const description = `${formData.desc1} ${formData.desc2}`;
    const payload: createViolationProps = {
      report_title: formData.report_title,
      reported_by_pkid: Number(formData.reported_by_pkid),
      latitude: location.lat,
      longitude: location.lng,
      reported_at,
      violation_type: formData.violation_type as ViolationType,
      status: 'UNDER_REVIEW',
      severity: formData.severity as ViolationSeverity,
      description,
      office_pkid: officeData[0]?.pkid || 0,
    };
    createViolation(payload, {
      onSuccess: () => {
        handleClose();
        setFormData({
          report_title: '',
          reported_by_pkid: '',
          violation_type: '',
          severity: '',
          desc1: '',
          desc2: '',
          reported_at: '',
          violationEvidence: null,
        });
        setLocation(DefaultLocation);
        setZoom(DefaultZoom);
        //
        queryClient.invalidateQueries();
        Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('violation_success'),
        });
      },
      onError: error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: t('error_occurred') + `: ${error.message}`,
        });
      },
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
                  {t('add_new')} {t('violations')}{' '}
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
                      className='btn btn-outline-primary my-4'
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
                        value={location.lng.toFixed(4)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className='flex w-full gap-7'>
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
                          {t('choose')} {t('reporter')}
                        </option>
                        {getAllUser.map(
                          (user: { pkid: string; username: string }) => (
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
                          {t('choose')} {t('violation_type')}
                        </option>
                        {Object.entries(violationTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='flex w-full gap-7'>
                    <div className='w-full'>
                      <label htmlFor='desc1'>
                        {t('violation_object')}
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='desc1'
                        name='desc1'
                        type='text'
                        placeholder='Pencurian ikan / Polusi / Kerusakan'
                        className='form-input'
                        value={formData.desc1}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='w-full'>
                      <label htmlFor='desc2'>
                        {t('violation_scale')}{' '}
                        <span className='text-red-600'>*</span>
                      </label>
                      <input
                        id='desc2'
                        name='desc2'
                        type='text'
                        placeholder='Masal / Besar / Parah'
                        className='form-input'
                        value={formData.desc2}
                        onChange={handleInputChange}
                      />
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

export default CreateModals;
