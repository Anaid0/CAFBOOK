import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

// Tipo de dirección sin id (se genera automáticamente en el backend)
type Direccion = {
  calle: string;
  vereda?: string;
  codigo_postal: string;
  ciudad_id: number;
  ciudad_nombre: string;
};

// Datos de ejemplo
const direccionesData: Direccion[] = [
  {
    calle: "Calle 123 #45-67",
    vereda: "Vereda Norte",
    codigo_postal: "110111",
    ciudad_id: 101,
    ciudad_nombre: "Bogotá"
  },
  {
    calle: "Carrera 9 #10-11",
    codigo_postal: "760001",
    ciudad_id: 202,
    ciudad_nombre: "Cali"
  },
  {
    calle: "Av. Principal Km 5",
    vereda: "Vereda El Carmen",
    codigo_postal: "050021",
    ciudad_id: 303,
    ciudad_nombre: "Medellín"
  },
];

const MisDireccionesScreen: React.FC<BottomTabScreenProps<any>> = ({ navigation }) => {
  const [direcciones] = useState<Direccion[]>(direccionesData);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis Direcciones</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AgregarDireccion')}>
          <Ionicons name="add-circle" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Lista de direcciones */}
      <ScrollView style={styles.direccionesList}>
        {direcciones.map((direccion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.direccionCard}
            onPress={() => navigation.navigate('DetalleDireccion', { direccion })}
          >
            <View style={styles.direccionHeader}>
              <Ionicons name="home" size={22} color="#4CAF50" />
              <Text style={styles.direccionCiudad}>{direccion.ciudad_nombre}</Text>
            </View>

            <Text style={styles.direccionTexto}>{direccion.calle}</Text>

            {direccion.vereda && (
              <Text style={styles.direccionTexto}>Vereda: {direccion.vereda}</Text>
            )}

            <Text style={styles.direccionTexto}>Código Postal: {direccion.codigo_postal}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    backgroundColor: '#FFFFFF', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
  direccionesList: { flex: 1, padding: 8 },
  direccionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  direccionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  direccionCiudad: { fontSize: 16, fontWeight: 'bold', color: '#333333', marginLeft: 8 },
  direccionTexto: { fontSize: 14, color: '#555555', marginBottom: 4 },
});

export default MisDireccionesScreen;
