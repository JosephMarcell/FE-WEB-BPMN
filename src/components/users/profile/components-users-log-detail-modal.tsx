import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

import IconX from '@/components/icon/icon-x';

import { Log } from '@/app/api/hooks/Profile/useGetUserLogs';

interface JsonObject {
  [key: string]: string | number | boolean | null | JsonObject | JsonObject[];
}

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logDetail: Log | null;
}

const LogDetailModal: React.FC<LogDetailModalProps> = ({
  isOpen,
  onClose,
  logDetail,
}) => {
  // Function to parse JSON safely
  const parseJson = (jsonString: string | null) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch {
      return null;
    }
  };

  // Filter out specific keys from JSON
  const filterJsonFields = (
    jsonObj: JsonObject | null,
    excludeKeys: string[],
  ) => {
    if (!jsonObj) return null;
    return Object.entries(jsonObj)
      .filter(([key]) => !excludeKeys.includes(key))
      .reduce<JsonObject>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  // Render JSON object as formatted fields
  const renderJsonFields = (jsonObj: JsonObject | null) => {
    if (!jsonObj) return null;
    return Object.entries(jsonObj).map(([key, value]) => (
      <div
        key={key}
        className='grid grid-cols-3 border-b border-gray-200 py-2 last:border-b-0'
      >
        <span className='font-medium capitalize text-gray-700'>
          {key.replace(/_/g, ' ')}
        </span>
        <span className='col-span-2 text-gray-900'>
          {typeof value === 'object'
            ? JSON.stringify(value)
            : value !== null
            ? String(value)
            : 'null'}
        </span>
      </div>
    ));
  };

  // Determine keys to exclude based on activity type
  const getFilteredReqBody = () => {
    const parsedReqBody = parseJson(logDetail?.req_body || null);

    if (!parsedReqBody) return null;

    const excludeKeys: string[] = [];
    if (logDetail?.activity_type === 'REGISTER') {
      excludeKeys.push('password', 'confirm_pwd'); // Exclude sensitive fields for REGISTER
    } else if (logDetail?.activity_type === 'LOGIN') {
      excludeKeys.push('password'); // Exclude password for LOGIN
    }
    return filterJsonFields(parsedReqBody, excludeKeys);
  };

  if (!logDetail) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-[998] overflow-y-auto'
        onClose={onClose}
      >
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/60' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='my-8 inline-block w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
              <Dialog.Panel>
                <div className='mb-4 flex items-center justify-between'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-bold text-purple-600'
                  >
                    Log Detail
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className='text-gray-500 hover:text-gray-700'
                  >
                    <IconX />
                  </button>
                </div>

                <div className='space-y-4 rounded-lg bg-gray-50 p-4'>
                  <div className='grid grid-cols-1 gap-4'>
                    {/* Basic Log Information */}
                    <div className='rounded-lg bg-white p-4 shadow'>
                      <h3 className='mb-3 text-lg font-semibold text-purple-500'>
                        Log Information
                      </h3>
                      <div className='space-y-2'>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Tipe Aktivitas
                          </span>
                          <span className='font-bold text-purple-700'>
                            {logDetail.activity_type}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Tanggal
                          </span>
                          <span>
                            {new Date(
                              logDetail.activity_time,
                            ).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long', // Nama bulan secara lengkap
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Waktu
                          </span>
                          <span>
                            {new Date(
                              logDetail.activity_time,
                            ).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit', // Menambahkan detik
                            })}
                          </span>
                        </div>

                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Aktor
                          </span>
                          <span>{logDetail.actor_username}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Role
                          </span>
                          <span>{logDetail.actor_role}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            Office
                          </span>
                          <span>{logDetail.office}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='font-medium text-gray-600'>
                            IP Address
                          </span>
                          <span>{logDetail.ip_address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Request Body Details */}
                    {logDetail.req_body && (
                      <div className='rounded-lg bg-white p-4 shadow'>
                        <h3 className='mb-3 text-lg font-semibold text-purple-500'>
                          Request Body
                        </h3>
                        <div className='rounded-md bg-gray-100 p-3'>
                          {renderJsonFields(getFilteredReqBody())}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LogDetailModal;
