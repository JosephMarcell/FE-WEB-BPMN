/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */

'use client';

import L from 'leaflet';
import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { TbDrone } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import { useDetailDrone } from '@/hooks/useDetailDrone';
import { useDetailMapModal } from '@/hooks/useDetailMapModal';

import LoadingSpinner from '@/components/layouts/loading-spinner';
import DynamicContentMap from '@/components/map/DynamicContentMap';
import DynamicMarker, {
  DynamicMarkerType,
} from '@/components/map/DynamicMarker';

import { IRootState } from '@/store';

import { CITY } from '@/constant/detailMapModal';
// import { getInstansi } from '@/services/dbQuerySimpatika';
// import getGisInstansi from '@/services/gis/getGisInstansi';
import getGisKota from '@/services/gis/getGisKota';

import Detail from './detail';

// set the default icon
const sizeMarkerIcon = 30;

type CityType = {
  data: any[];
  parentZoomClickCallback: (feature: any) => void;
};

const City = memo((props: CityType) => {
  const { data, parentZoomClickCallback } = props;

  const updateModalDetail = useDetailMapModal(
    (state: any) => state.updateModalDetail,
  );
  const setDetailDrone = useDetailDrone((state: any) => state.setShow);

  const [markers, setMarkers] = useState<DynamicMarkerType[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [institusi, setInstitusi] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorContext, setErrorContext] = useState<'city' | 'marker' | null>(
    null,
  );
  const [failedFeature, setFailedFeature] = useState<any>(null);
  const [failedMarker, setFailedMarker] = useState<any>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const isSidebarOpen = useSelector(
    (state: IRootState) => state.themeConfig.sidebar,
  );

  useEffect(() => {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');

    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
    if (footer) {
      setFooterHeight(footer.offsetHeight);
    }
  }, []);

  const zoomInCallback = async () => {
    // console.log('zoomInCallback');
    // TODO: if zoom in provincy, then show provincy detail
    // TODO: if zoom in city, then show city detail
  };

  const zoomResetCallback = async () => {
    // console.log('zoomResetCallback');
    // TODO: // Set default filter popup & details indonesia
  };

  const zoomClickCallback = useCallback(
    async (feature: any) => {
      setIsLoading(true);
      setIsError(false);
      setErrorContext(null);
      setFailedFeature(null);

      try {
        if (!feature.properties.isCity) {
          parentZoomClickCallback(feature);
        } else {
          const filteredDrones = await getGisKota(feature.properties);
          // const city = cities.cities[0];
          // const data = cities.cities.length ? await getGisInstansi(city) : [];

          const newMarkers = filteredDrones.map((drone: any) => ({
            lat: drone.origin_latitude ?? 0,
            lng: drone.origin_longitude ?? 0,
            icon: L.divIcon({
              className: 'custom-marker-icon', // Optional CSS styling
              html: ReactDOMServer.renderToString(
                <TbDrone size={sizeMarkerIcon} color='yellow' />,
              ),
              iconSize: [sizeMarkerIcon, sizeMarkerIcon],
              iconAnchor: [sizeMarkerIcon / 2, sizeMarkerIcon],
              popupAnchor: [0, -sizeMarkerIcon],
            }),
            id: drone.id,
            data: drone,
          }));
          setMarkers(newMarkers);
          updateModalDetail({ detailModal: CITY, feature });
        }
      } catch (error) {
        setIsError(true);
        setErrorContext('city');
        setFailedFeature(feature);
      } finally {
        setIsLoading(false);
      }
    },
    [parentZoomClickCallback, updateModalDetail],
  );

  const handleClickMarker = useCallback(async (marker: any) => {
    setIsLoading(true);
    setIsError(false);
    setErrorContext(null);
    setFailedMarker(null);

    try {
      // const dataSimpatika = await getInstansi(marker);
      // setInstitusi({ marker, dataSimpatika });
      // setShow(true);
      // setDetailSekolah(true);
    } catch (error) {
      setIsError(true);
      setErrorContext('marker');
      setFailedMarker(marker);
      console.error('Error fetching marker data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRetry = useCallback(async () => {
    if (errorContext === 'city' && failedFeature) {
      await zoomClickCallback(failedFeature);
    } else if (errorContext === 'marker' && failedMarker) {
      await handleClickMarker(failedMarker);
    }
  }, [
    errorContext,
    failedFeature,
    failedMarker,
    zoomClickCallback,
    handleClickMarker,
  ]);

  const sidebarWidth = isSidebarOpen ? 0 : 260;

  return (
    <>
      {data.map((city: any, index: number) => (
        <DynamicContentMap
          key={`city-${index}`}
          data={city}
          zoomInCallback={zoomInCallback}
          zoomResetCallback={zoomResetCallback}
          zoomClickCallback={zoomClickCallback}
        />
      ))}
      {markers.map((marker: any) => (
        <DynamicMarker
          key={marker.id}
          lat={marker.lat}
          lng={marker.lng}
          icon={marker.icon}
          id={marker.id}
          handleClickMarker={() => handleClickMarker(marker.data)}
        />
      ))}

      {isLoading &&
        ReactDOM.createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm'
            style={{
              marginTop: `${headerHeight}px`,
              marginBottom: `${footerHeight}px`,
              marginLeft: `${sidebarWidth}px`,
            }}
          >
            <LoadingSpinner isError={isError} onRetry={onRetry} />
          </div>,
          document.body,
        )}

      {show && (
        <Detail
          handleClickMarker={handleClickMarker}
          show={show}
          // data={selectedDrone}
          isLoading={isLoading}
        />
      )}
    </>
  );
});

City.displayName = 'City';

export default City;
