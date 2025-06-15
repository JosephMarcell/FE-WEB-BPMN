/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-var */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */

'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { getListFiles } from '@/helpers/utils/gis/file-reader';
import { useSelector } from 'react-redux';
import DynamicContentMap from '@/components/map/DynamicContentMap';
import City from '@/app/(dashboard)/live-tracking/city';
import { useDetailMapModal } from '@/hooks/useDetailMapModal';
import { PROVINCE } from '@/constant/detailMapModal';
import { IRootState } from '@/store';

import LoadingSpinner from '@/components/layouts/loading-spinner';
import ReactDOM from 'react-dom';

const Province = memo((props: any) => {
  const updateModalDetail = useDetailMapModal(
    (state: any) => state.updateModalDetail,
  );

  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
    // TODO: if zoom in provincy, then show provincy detail
    // TODO: if zoom in city, then show city detail
  };

  const zoomResetCallback = async () => {
    // TODO: // Set default filter popup & details indonesia
  };

  const zoomClickCallback = useCallback(async (feature: any) => {
    try {
      setIsLoading(true); // Start loading
      setCities([]);

      const province = feature.properties.name
        .replaceAll(' ', '_')
        .toLowerCase();
      const path = `assets/geojson/cities/${province}`;
      const files = await getListFiles(path);
      const fetchers = files.map(
        async filename =>
          await fetch(`/${path}/${filename}`).then(response => response.json()),
      );

      await Promise.all(fetchers).then((responses: any) => {
        const data = responses
          .filter((e: any) => e.features) // Yang diketahui kota 7324 sulawesi selatan, tidak ada value pada geojson
          .map((response: any) => {
            response.features = response.features.map((feature: any) => {
              feature.properties = {
                ...feature.properties,
                color: 'rgba(255, 255, 255, 0.3)',
                strokeColor: 'rgba(255, 255, 255, 0.8)',
                strokeWeight: 0.8,
                isCity: true,
              };

              return feature;
            });

            return response;
          });

        updateModalDetail({ detailModal: PROVINCE, feature });
        setCities(data);
      });
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sidebarWidth = isSidebarOpen ? 0 : 260;

  return (
    <>
      <DynamicContentMap
        data={props.data}
        zoomInCallback={zoomInCallback}
        zoomResetCallback={zoomResetCallback}
        zoomClickCallback={zoomClickCallback}
      />
      {!!cities.length && (
        <City data={cities} parentZoomClickCallback={zoomClickCallback} />
      )}

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
            <LoadingSpinner
              isError={isError}
              onRetry={async () => {
                if (props.feature) {
                  setIsError(false);
                  await zoomClickCallback(props.feature);
                }
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
});

export default Province;
