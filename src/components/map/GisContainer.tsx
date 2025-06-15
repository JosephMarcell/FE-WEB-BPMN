/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { memo, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { useGisMap } from '@/hooks/gis/useMap';

import { DEFAULT_ZOOM_LEVEL } from '@/components/map/DynamicContentMap';

import Province from '@/app/(dashboard)/live-tracking/Province';
import { getListFiles } from '@/helpers/utils/gis/file-reader';

const Gis = memo(() => {
  const setAllProvince = useGisMap((state: any) => state.setAllProvince);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState<any[]>();

  useEffect(() => {
    const fetchData = async () => {
      const path = `assets/geojson/provincies`;
      const files = await getListFiles(path);
      const fetchers = files.map(
        async filename =>
          await fetch(`/${path}/${filename}`).then(response => response.json()),
      );

      await Promise.all(fetchers).then((responses: any) => {
        const data = responses.map((response: any) => {
          response.features = response.features.map((feature: any) => {
            feature.properties = {
              ...feature.properties,
              color: 'rgba(255, 255, 255, 0.3)',
              strokeColor: 'rgba(255, 255, 255, 0.8)',
              strokeWeight: 0.8,
            };

            return feature;
          });

          return response;
        });

        setArea(data);
        setAllProvince(data);
        setLoading(false);
      });
    };

    fetchData();
  }, [setArea, setAllProvince]);

  return (
    <div className='ml-[-15px] mt-[-20px]'>
      {loading ? <>Tunggu sebentar</> : <Container data={area} />}
    </div>
  );
});

const Container = (props: any) => {
  const data = props.data;

  return (
    <div className='relative w-full lg:h-[553px]'>
      <MapContainer
        zoomControl={false}
        center={[0.968624, 119.820058]}
        zoom={DEFAULT_ZOOM_LEVEL}
        style={{ height: '100%', width: '100%', zIndex: '0' }}
      >
        <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIAMAPS_API_KEY}`}
          opacity={0.8}
        />
        <Province data={data} />
      </MapContainer>
    </div>
  );
};

export default Gis;
