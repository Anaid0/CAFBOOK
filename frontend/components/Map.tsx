// app/components/Map.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Importar expo-location

// Obtener el tamaño de la pantalla
const { width, height } = Dimensions.get('window');

// Definir el tipo de datos para la ubicación
type LocationType = {
  latitude: number;
  longitude: number;
};

const Map = () => {
  // Definir el estado con el tipo LocationType o null (inicialmente es null)
  const [location, setLocation] = useState<LocationType | null>(null);

  // useEffect para obtener la ubicación del usuario cuando el componente se monte
  useEffect(() => {
    const getLocation = async () => {
      // Solicitar permisos de ubicación (actualización para SDK 45+)
      let { status } = await Location.requestForegroundPermissionsAsync(); // Actualización aquí
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return; // Si no se conceden permisos, no continuar
      }

      // Obtener la ubicación actual del usuario
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords); // Guardar las coordenadas en el estado
    };

    getLocation(); // Llamar a la función para obtener la ubicación
  }, []); // El efecto solo se ejecuta una vez al montar el componente

  // Si aún no tenemos ubicación, mostramos un View vacío
  if (!location) {
    return <View style={{ flex: 1 }} />;
  }

  // Renderizar el mapa con las coordenadas obtenidas
  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT} // Usar Mapbox como proveedor
        style={{ width, height }} // Establecer el tamaño del mapa
        region={{
          latitude: location.latitude, // Latitud actual del usuario
          longitude: location.longitude, // Longitud actual del usuario
          latitudeDelta: 0.0922, // Zoom del mapa (puedes ajustarlo)
          longitudeDelta: 0.0421, // Zoom del mapa (puedes ajustarlo)
        }}
        mapType="standard" // Tipo de mapa (puedes usar 'satellite', 'hybrid', etc.)
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }} // Coordenadas del marcador
          title="You are here" // Título del marcador
        />
      </MapView>
    </View>
  );
};

// Estilos para el mapa
const styles = StyleSheet.create({
  map: {
    flex: 1, // Hace que el mapa ocupe toda la pantalla
  },
});

export default Map;
