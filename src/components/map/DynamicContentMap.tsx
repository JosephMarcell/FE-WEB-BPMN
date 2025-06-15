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

import React, { memo, RefObject, useRef, useState } from 'react';
import { GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';

export const DEFAULT_ZOOM_LEVEL = 5;

type DynamicContentMapType = {
  data: any;
  zoomInCallback: () => void;
  zoomResetCallback: () => void;
  zoomClickCallback: (feature: any) => void;
};

const DynamicContentMap = memo((props: DynamicContentMapType) => {
  const { data, zoomInCallback, zoomResetCallback, zoomClickCallback } = props;
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
  const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
  const map = useMap();

  const zoomEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(zoomEvents.getZoom());
    },
  });

  if (zoomLevel > DEFAULT_ZOOM_LEVEL) {
    zoomInCallback();
  } else {
    zoomResetCallback();
    // Set default filter popup & details indonesia
  }

  const highlightFeature = (e: Leaflet.LeafletMouseEvent) => {
    const layer = e.target;

    layer.setStyle({
      color: 'rgba(255, 255, 255, 1)',
      dashArray: '',
      fillOpacity: 0.7,
      weight: 1,
    });
  };

  const resetHighlight = (e: Leaflet.LeafletMouseEvent) => {
    geoJson.current?.resetStyle(e.target);
  };

  const zoomToFeature = async (e: Leaflet.LeafletMouseEvent, feature: any) => {
    // Zoom to clicked area & center
    map.fitBounds(e.target.getBounds());

    zoomClickCallback(feature);
  };

  return (
    <GeoJSON
      data={data}
      key='usa-states'
      ref={geoJson}
      style={(feature: any) => {
        return {
          color: feature.properties.strokeColor || 'rgba(255, 255, 255, 0.8)',
          fillColor: feature.properties.color || 'rgba(255, 255, 255, 0.3)',
          weight: feature.properties.strokeWeight || 0.8,
          fillOpacity: 0.3,
        };
      }}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: e => {
            zoomToFeature(e, feature);
          },
          mouseout: e => {
            resetHighlight(e);
          },
          mouseover: e => {
            highlightFeature(e);
          },
        });
      }}
    />
  );
});

export default DynamicContentMap;
