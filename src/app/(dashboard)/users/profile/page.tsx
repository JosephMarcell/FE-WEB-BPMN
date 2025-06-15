/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getTranslation } from '@/lib/lang/i18n';

import IconCoffee from '@/components/icon/icon-coffee';
import IconFolder from '@/components/icon/icon-folder';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconUser from '@/components/icon/icon-user';
import LogDetailModal from '@/components/users/profile/components-users-log-detail-modal';
import ComponentsUserProfileUpdateModal from '@/components/users/profile/components-users-profile-update-modal';

import { Log, useGetUserLogs } from '@/app/api/hooks/Profile/useGetUserLogs';
import { useGetUserProfile } from '@/app/api/hooks/Profile/useGetUserProfile';

const ComponentsUsersProfileLocation = dynamic(
  () =>
    import(
      '@/components/users/profile/components-users-profile-location-modal'
    ),
  { ssr: false },
);

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  {
    ssr: false,
  },
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  {
    ssr: false,
  },
);
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});

const defaultCenter = {
  lat: -1.252,
  lng: 118.0,
};

const Profile = () => {
  const { t } = getTranslation();
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
    refetch,
  } = useGetUserProfile();
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSetModalProfile = (isOpen: boolean) => {
    setIsProfileModalOpen(isOpen);
  };

  const handleSetModalLocation = (isOpen: boolean) => {
    setIsLocationModalOpen(isOpen);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  // Update map center with user's stored location if available
  useEffect(() => {
    if (userData && userData.latitude && userData.longitude) {
      setMapCenter({
        lat: userData.latitude,
        lng: userData.longitude,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
        },
        error => {
          console.error('Error obtaining location:', error);
          setMapCenter(defaultCenter);
        },
        { enableHighAccuracy: true },
      );
    } else {
      setMapCenter(defaultCenter);
    }
  }, [userData]);

  const {
    data: logs,
    isLoading: isLoadingLogs,
    error: logsError,
  } = useGetUserLogs();

  if (isLoadingUser || isLoadingLogs) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error: {userError.message}</div>;
  }

  if (logsError) {
    return <div>Error: {logsError.message}</div>;
  }

  if (!userData || !logs) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <ul className='flex space-x-2 rtl:space-x-reverse'>
        <li>
          <Link href='#' className='text-primary hover:underline'>
            {t('users')}
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>{t('profile')}</span>
        </li>
      </ul>
      <div className='pt-5'>
        <div className='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4'>
          <div className='panel xl:col-span-2'>
            <div className='mb-5 flex items-center justify-between'>
              <h5 className='dark:text-white-dark text-2xl font-semibold text-[#00A1FF]'>
                {t('profile')}
              </h5>
            </div>
            <div className='my-[52px]'>
              <div className='flex items-center'>
                <div className='shrink-0 rounded-full ring-4 ring-[#00A1FF] ltr:mr-4 rtl:ml-4'>
                  <Image
                    src={
                      userData.profile_image_url ||
                      '/assets/images/profile-unknown.jpg'
                    }
                    alt='img'
                    className='h-64 w-64 rounded-full object-cover'
                    width={250}
                    height={250}
                  />
                </div>
                <div className='flex h-full w-full flex-col pl-2'>
                  <ul className='text-white-dark flex h-full flex-col space-y-4 font-semibold'>
                    <p className='text-2xl font-semibold text-[#00A1FF]'>
                      {userData.full_name || userData.username}
                    </p>
                    <li className='flex items-center gap-2'>
                      <IconCoffee className='shrink-0' /> {userData.username}
                    </li>
                    <li className='flex items-center gap-2'>
                      <IconUser />
                      <span className='whitespace-nowrap' dir='ltr'>
                        {userData.role}
                      </span>
                    </li>
                    <li>
                      <button className='flex items-center gap-2'>
                        <IconMail className='h-5 w-5 shrink-0' />
                        <span className='truncate text-[#00A1FF]'>
                          {userData.email}
                        </span>
                      </button>
                    </li>
                    {userData.alamat && (
                      <li className='flex items-center gap-2'>
                        <IconMapPin className='shrink-0' />
                        <span className='whitespace-nowrap' dir='ltr'>
                          {userData.alamat}
                        </span>
                      </li>
                    )}
                    <li className='flex items-center gap-2'>
                      <IconFolder />
                      <span className='whitespace-nowrap' dir='ltr'>
                        Status:{' '}
                        {userData.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='mt-4 flex justify-around text-center'>
              <Link
                href='/auth/change-password'
                className='w-full rounded px-4 py-2 text-[#00A1FF] ltr:mr-2 rtl:ml-2'
              >
                {t('change_password')}
              </Link>
              <button
                type='button'
                className='w-full rounded bg-[#00A1FF] px-4 py-2 text-white'
                onClick={() => handleSetModalProfile(true)}
              >
                {t('update_profile')}
              </button>
              <ComponentsUserProfileUpdateModal
                modal={isProfileModalOpen}
                setModal={handleSetModalProfile}
                currentProfileData={userData}
                onUpdateSuccess={refetch}
              />
            </div>
          </div>
          <div className='panel xl:col-span-2'>
            <div className='mb-5'>
              <h5 className='dark:text-white-dark text-2xl font-semibold text-[#00A1FF]'>
                {t('location')}
              </h5>
            </div>
            <div className='relative'>
              <div className='relative flex h-[324px] flex-col gap-4'>
                <MapContainer
                  zoomControl={false}
                  center={mapCenter}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
                  <TileLayer
                    url={`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png&api_key=${process.env.NEXT_PUBLIC_STADIAMAPS_API_KEY}`}
                    opacity={0.8}
                  />
                  <Marker position={mapCenter}>
                    <Popup>{userData.alamat || 'Your current location'}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            <div className='mt-4'>
              <button
                type='button'
                className='btn btn-secondary w-full bg-[#00A1FF]'
                onClick={() => handleSetModalLocation(true)}
              >
                {t('update_location')}
              </button>
              <ComponentsUsersProfileLocation
                modal={isLocationModalOpen}
                setModal={handleSetModalLocation}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                userData={userData}
                onUpdateSuccess={refetch}
              />
            </div>
          </div>
        </div>

        {/* Rest of the code remains the same */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-1'>
          {/* Activity log section */}
          <div className='panel'>
            <div className='mb-5'>
              <h5 className=' dark:text-white-dark text-2xl font-semibold text-[#00A1FF]'>
                {t('recent_activity')}
              </h5>
            </div>
            <div className='h-72 space-y-4 overflow-y-auto rounded border border-[#ebedf2] p-4'>
              {logs.map((log, index) => (
                <div
                  key={index}
                  className='h-20 w-full rounded border border-[#ebedf2] px-4 py-2 dark:border-[#1b2e4b] dark:bg-[#1b2e4b]'
                  onClick={() => setSelectedLog(log)}
                >
                  {/* Log display remains the same */}
                  <div className='flex h-full flex-row content-center font-semibold'>
                    <div className='flex flex-col justify-center pr-2 font-semibold ltr:ml-4 rtl:mr-4'>
                      <h6 className='dark:text-white-light text-center text-[13px]'>
                        {new Date(log.activity_time).toLocaleTimeString(
                          'en-GB',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </h6>

                      <h6 className='text-white-dark dark:text-white-dark text-[13px]'>
                        {new Date(log.activity_time).toLocaleDateString(
                          'id-ID',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                      </h6>
                    </div>

                    <div className='w-0 border border-r-4'></div>
                    <div className='flex flex-col justify-center font-semibold ltr:ml-4 rtl:mr-4'>
                      <p className='mx-0 w-full text-[#00A1FF] ltr:ml-auto rtl:mr-auto'>
                        {log.activity_type}
                      </p>
                      <p>
                        {[
                          'LOGIN',
                          'REGISTER',
                          'RESET PASSWORD',
                          'CHANGE PASSWORD',
                        ].includes(log.activity_type)
                          ? `Anda melakukan ${log.activity_type} dengan IP Address ${log.ip_address}.`
                          : log.activity_type === 'SEND RESET PASSWORD' &&
                            log.req_body
                          ? `Anda melakukan SEND RESET PASSWORD pada email ${
                              JSON.parse(log.req_body)?.email ||
                              'tidak diketahui'
                            }.`
                          : ['CREATE USER', 'EDIT PROFILE'].includes(
                              log.activity_type,
                            ) && log.req_body
                          ? `Anda ${
                              log.activity_type === 'CREATE USER'
                                ? 'membuat pengguna baru'
                                : 'mengubah profil pengguna'
                            } dengan username ${
                              JSON.parse(log.req_body)?.username ||
                              'tidak diketahui'
                            }.`
                          : `Anda melakukan ${log.activity_type} pada tabel ${
                              log.target_table
                            } ${
                              log.target_pkid
                                ? `dengan PKID ${log.target_pkid}`
                                : ''
                            }.`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Log Detail Modal */}
        <LogDetailModal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          logDetail={selectedLog}
        />
      </div>
    </div>
  );
};

export default Profile;
