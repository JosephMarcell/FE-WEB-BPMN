/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DivIcon, Icon, IconOptions } from 'leaflet';
import React from 'react';
import { Marker } from 'react-leaflet';

export type DynamicMarkerType = {
  lat: number;
  lng: number;
  icon: Icon<IconOptions> | DivIcon;
  id: any;
  handleClickMarker?: (id: any) => void;
};

function DynamicMarker(props: DynamicMarkerType) {
  const { lat, lng, icon, id, handleClickMarker } = props;

  if (lat === undefined || lng === undefined) {
    console.error(`Invalid coordinates for marker:`, { id, lat, lng });
    return null;
  }

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{
        click: () => handleClickMarker?.(id),
      }}
    />
  );
}

export default DynamicMarker;
