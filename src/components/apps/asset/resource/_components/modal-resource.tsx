import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';
import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { useCreateResource } from '@/app/api/hooks/fixed_asset/resource/useCreateResource';
import { useGetResourceById } from '@/app/api/hooks/fixed_asset/resource/useGetResourceByPkid';
import { useUpdateResource } from '@/app/api/hooks/fixed_asset/resource/useUpdateResource';
import { assetListInitialState } from '@/helpers/utils/fixed_asset/asset_list';
import { resourceInitialState } from '@/helpers/utils/fixed_asset/resource';

const { t } = getTranslation();

interface IModalResourceProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}

const DefaultLocation = {
  lat: -7.2586, // Latitude of Surabaya
  lng: 112.7485, // Longitude of Surabaya
};
const DefaultZoom = 7;

const ModalResource = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalResourceProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const { mutateAsync: createResource } = useCreateResource();
  const { mutateAsync: updateResource } = useUpdateResource();
  const [assetForm, setAssetForm] = useState(assetListInitialState);
  const [form, setForm] = useState(resourceInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const {
    data: resourceDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetResourceById(pkid, enabled);

  const {
    data: assetList,
    isLoading: isLoadingAssetList,
    refetch: refetchAssetList,
  } = useGetAllAsset();

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (resourceDetail && modalEdit) {
      setForm(resourceDetail);
    }
  }, [resourceDetail, modalEdit]);

  useEffect(() => {
    if (assetList && !isLoadingAssetList) {
      setAssetForm(assetList);
      refetchAssetList();
    }
  }, [assetList, isLoadingAssetList, refetchAssetList]);

  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = ['pkid', 'office_pkid', 'office_name'] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );

    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === 0 ||
        temp[field as keyof typeof temp] === undefined
      ) {
        requiredField.push(field);
      }
    });
    if (requiredField.length > 0) {
      setEmptyField(requiredField);
      return false;
    }
    return true;
  };

  const handleOnChange = (value: string | number | Date, key: string) => {
    setForm({ ...form, [key]: value });
  };
  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(resourceInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(resourceInitialState);
      setEmptyField([]);
    } else {
      Swal.fire({
        title: t('are_you_sure'),
        text: t('not_revertable'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes_continue'),
        cancelButtonText: t('no_cancel'),
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            setForm(resourceInitialState);
            setEmptyField([]);
          } catch (error) {
            Swal.fire('Error!', t('error_occurred'), 'error');
          }
        }
      });
    }
  };
  const handleSubmit = async () => {
    const isMandatoryFilled = mandatoryValidation();
    const fieldTranslations: Record<string, string> = {
      asset_pkid: t('asset_id'),
      resource_name: t('resource_name'),
      resource_latitude: t('latitude'),
      resource_longitude: t('longitude'),
      description: t('description'),
    };

    // Map the empty field names to their translations
    const translatedEmptyFields = emptyField
      .map(field => fieldTranslations[field] || field) // If no translation found, keep the original field name
      .join(', ');

    if (!isMandatoryFilled) {
      Swal.fire({
        title: t('empty_field'),
        text: t('please_fill') + ` ${translatedEmptyFields}!`,
        icon: 'error',
        confirmButtonText: t('close'),
      });
    } else {
      Swal.fire({
        title: t('are_you_sure'),
        text: t('not_revertable'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes_continue'),
        cancelButtonText: t('no_cancel'),
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            if (modalEdit) {
              const tempForm = { ...form };
              const formAfterDeletion = deleteBaseAttributes(tempForm);

              await updateResource({
                pkid: pkid,
                data: formAfterDeletion,
              });
              setModalEdit(false);
            }
            if (modal) {
              const {
                asset_pkid,
                resource_name,
                resource_latitude,
                resource_longitude,
                description,
              } = form;
              await createResource({
                asset_pkid: asset_pkid ?? 0,
                resource_name: resource_name ?? '',
                resource_latitude: resource_latitude ?? location.lat,
                resource_longitude: resource_longitude ?? location.lng,
                description: description ?? '',
              });

              setModal(false);
            }
            setForm(resourceInitialState);
            setEmptyField([]);
            Swal.fire(t('success'), t('resource_saved'), 'success').then(() => {
              refetch();
            });
          } catch (error) {
            Swal.fire('Error!', t('error_occurred'), 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(resourceInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  const initializeMap = useCallback(() => {
    if (mapRef.current && window.google && window.google.maps) {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: DefaultLocation,
        zoom: zoom,
      });

      markerRef.current = new google.maps.Marker({
        position: { lat: -7.2586, lng: 112.7485 },
        map: mapInstanceRef.current,
        draggable: true,
      });

      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          const newLat = position.lat();
          const newLng = position.lng();
          setLocation({ lat: newLat, lng: newLng });
          setForm(prevForm => ({
            ...prevForm,
            resource_latitude: newLat,
            resource_longitude: newLng,
          }));
        }
        const mapInstance = markerRef.current?.getMap();
        const zoom = mapInstance?.getZoom();
        if (zoom !== undefined) {
          setZoom(zoom);
        }
      });
    }
  }, [zoom]);

  const refreshMap = useCallback(() => {
    if (mapRef.current && window.google && window.google.maps) {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: DefaultLocation,
        zoom: DefaultZoom,
      });

      const currentLocation = markerRef.current?.getPosition();

      markerRef.current = new google.maps.Marker({
        position: currentLocation,
        map: mapInstanceRef.current,
        draggable: true,
      });

      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          setForm(prevForm => ({
            ...prevForm,
            resource_latitude: position.lat(),
            resource_longitude: position.lng(),
          }));
        }
      });
    }
  }, [setForm]);

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
      loadGoogleMapsScript(); // Load and initialize the map whenever the modal opens
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

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog
        as='div'
        open={modal || modalEdit}
        onClose={() => {
          if (modalEdit) {
            setModalEdit(true);
          }
          if (modal) {
            setModal(true);
          }
        }}
      >
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
                  {modal
                    ? t('add') + ' ' + t('resources')
                    : t('edit') + ' ' + t('resources')}
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
                  {modal ? (
                    <div>
                      <label
                        htmlFor='asset_pkid'
                        className='block text-sm font-medium'
                      >
                        {t('asset_id')}
                      </label>
                      <select
                        id='asset_pkid'
                        value={assetForm.asset_code}
                        onChange={e =>
                          handleOnChange(Number(e.target.value), 'asset_pkid')
                        }
                        className='form-select'
                      >
                        <option value='' disabled>
                          {t('select_asset_id')}
                        </option>
                        {Array.isArray(assetForm) &&
                          assetForm.map(asset => (
                            <option key={asset.asset_code} value={asset.pkid}>
                              {asset.asset_code}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor='asset_pkid'>
                        {t('asset_id')} <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        id='asset_pkid'
                        name='asset_pkid'
                        type='number'
                        placeholder={t('enter_asset_id')}
                        className='form-input'
                        onChange={e =>
                          handleOnChange(Number(e.target.value), 'asset_pkid')
                        }
                        disabled
                        value={form.asset_pkid || ''}
                        style={{
                          borderColor: emptyField.includes('asset_pkid')
                            ? 'red'
                            : '',
                          backgroundColor: '#f0f0f0',
                          color: '#b0b1b1',
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor='resource_name'>
                      {t('resource_name')}{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      id='resource_name'
                      name='resource_name'
                      type='text'
                      placeholder={t('enter_resource_name')}
                      className='form-input'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'resource_name')
                      }
                      disabled={!modal}
                      value={form.resource_name || ''}
                      style={{
                        borderColor: emptyField.includes('resource_name')
                          ? 'red'
                          : '',
                        backgroundColor: modal ? '' : '#f0f0f0',
                        color: modal ? '' : '#b0b1b1',
                      }}
                    />
                  </div>
                  <div
                    ref={mapRef}
                    style={{ height: '400px', marginBottom: '1rem' }}
                  />
                  <div className='mb-4 flex justify-end'>
                    <button
                      onClick={refreshMap} // Trigger the map initialization
                      className='btn btn-outline-primary'
                    >
                      {t('reload_map')}
                    </button>
                  </div>
                  <div>
                    <label>{t('latitude')}</label>
                    <input
                      type='number'
                      value={form.resource_latitude}
                      readOnly
                      className='form-input'
                    />
                  </div>

                  <div>
                    <label>{t('longitude')}</label>
                    <input
                      type='number'
                      value={form.resource_longitude}
                      readOnly
                      className='form-input'
                    />
                  </div>

                  <div>
                    <label htmlFor='description'>{t('description')}</label>
                    <textarea
                      id='description'
                      name='description'
                      rows={3}
                      className='form-textarea'
                      placeholder={t('enter_description')}
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'description')
                      }
                      value={form.description || ''}
                      required
                      style={{
                        borderColor: emptyField.includes('description')
                          ? 'red'
                          : '',
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                  <button
                    onClick={handleCancel}
                    type='button'
                    className='btn btn-outline-danger'
                  >
                    {t('discard')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
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
export default ModalResource;
