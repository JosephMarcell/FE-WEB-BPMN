/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Dialog, Transition } from '@headlessui/react';
import L from 'leaflet';
import React, { Fragment, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { getTranslation } from '@/lib/lang/i18n';

import { UserData } from '@/app/api/hooks/Profile/useGetUserProfile';
import { updateUserData } from '@/app/api/hooks/Profile/useUpdateUserData';

interface LocationModalProps {
  modal: boolean;
  setModal: (isOpen: boolean) => void;
  mapCenter: { lat: number; lng: number };
  setMapCenter: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number }>
  >;
  userData: UserData;
  onUpdateSuccess: () => void;
}

// Component that handles map click events
const LocationMarker = ({ position, setPosition }: any) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const ComponentsUsersProfileLocation = ({
  modal,
  setModal,
  mapCenter,
  setMapCenter,
  userData,
  onUpdateSuccess,
}: LocationModalProps) => {
  const { t } = getTranslation();
  const [newLocation, setNewLocation] = useState(mapCenter);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateUserData({
        latitude: newLocation.lat,
        longitude: newLocation.lng,
      });

      setMapCenter(newLocation);
      onUpdateSuccess();
      setModal(false);
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Configure Leaflet icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        onClose={() => setModal(false)}
      >
        <div className='flex min-h-screen items-center justify-center px-4'>
          <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black'>
            <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
              <h5 className='text-lg font-bold'>{t('location_edit_title')}</h5>
              <button
                onClick={() => setModal(false)}
                type='button'
                className='text-white-dark hover:text-dark'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M6 18L18 6M6 6L18 18'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
            <div className='p-5'>
              <p className='mb-5'>{t('click_to_set_location')}</p>
              <div className='mb-5 h-[400px] w-full'>
                <MapContainer
                  center={mapCenter}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                  <TileLayer
                    url={`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png&api_key=${process.env.NEXT_PUBLIC_STADIAMAPS_API_KEY}`}
                    opacity={0.8}
                  />
                  <LocationMarker
                    position={newLocation}
                    setPosition={setNewLocation}
                  />
                </MapContainer>
              </div>
              <div className='mt-8 flex items-center justify-end'>
                <button
                  onClick={() => setModal(false)}
                  type='button'
                  className='btn btn-outline-danger'
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSave}
                  type='button'
                  className='btn btn-primary ltr:ml-4 rtl:mr-4'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('saving') : t('save_location')}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ComponentsUsersProfileLocation;
