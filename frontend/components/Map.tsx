import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { MAPBOX_ACCESS_TOKEN } from '@env';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default function MyMapboxMap() {
  return (
    <MapboxGL.MapView style={{ flex: 1 }}>
      <MapboxGL.Camera
        zoomLevel={12}
        centerCoordinate={[-74.0721, 4.7110]} // longitud, latitud
      />
    </MapboxGL.MapView>
  );
}
