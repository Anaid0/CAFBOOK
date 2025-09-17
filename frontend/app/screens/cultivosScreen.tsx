import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";





// Iconos (puedes reemplazar con tus propios iconos)
import { Ionicons } from '@expo/vector-icons';

// Tipos para nuestros cultivos
type Cultivo = {
  id: string;
  nombre: string;
  tipo: string;
  area: number;
  estado: 'saludable' | 'en-riesgo' | 'enfermo' | 'cosechado';
  ubicacion: string;
  fechaSiembra: string;
  imagen?: string;
};

// Datos de ejemplo para los cultivos
const cultivosData: Cultivo[] = [
  {
    id: '1',
    nombre: 'Maíz Norte',
    tipo: 'Maíz',
    area: 2.5,
    estado: 'saludable',
    ubicacion: 'Parcela A',
    fechaSiembra: '2023-05-15',
  },
  {
    id: '2',
    nombre: 'Trigo Sur',
    tipo: 'Trigo',
    area: 1.8,
    estado: 'en-riesgo',
    ubicacion: 'Parcela B',
    fechaSiembra: '2023-06-10',
  },
  {
    id: '3',
    nombre: 'Soja Este',
    tipo: 'Soja',
    area: 3.2,
    estado: 'saludable',
    ubicacion: 'Parcela C',
    fechaSiembra: '2023-04-22',
  },
  {
    id: '4',
    nombre: 'Cebada Oeste',
    tipo: 'Cebada',
    area: 2.1,
    estado: 'enfermo',
    ubicacion: 'Parcela D',
    fechaSiembra: '2023-05-30',
  },
  {
    id: '5',
    nombre: 'Maíz Central',
    tipo: 'Maíz',
    area: 4.0,
    estado: 'cosechado',
    ubicacion: 'Parcela E',
    fechaSiembra: '2023-03-18',
  },
];

const CultivosScreen: React.FC<BottomTabScreenProps<any>> = ({ navigation }) => {
  const [cultivos] = useState<Cultivo[]>(cultivosData);
  const [filtro, setFiltro] = useState<string>('todos');
  type IoniconName = keyof typeof Ionicons.glyphMap;

  // Filtrar cultivos según el estado seleccionado
  const cultivosFiltrados = filtro === 'todos' 
    ? cultivos 
    : cultivos.filter(c => c.estado === filtro);

  // Función para obtener el color según el estado del cultivo
  const getColorByEstado = (estado: string) => {
    switch (estado) {
      case 'saludable': return '#4CAF50';
      case 'en-riesgo': return '#FFC107';
      case 'enfermo': return '#F44336';
      case 'cosechado': return '#9E9E9E';
      default: return '#757575';
    }
  };

  // Función para obtener el icono según el tipo de cultivo
  const getIconByTipo = (tipo: string): IoniconName => {
    switch (tipo.toLowerCase()) {
      case 'maíz': return 'leaf';
      case 'trigo': return 'leaf';
      case 'soja': return 'leaf';
      case 'cebada': return 'leaf';
      default: return 'leaf';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis Cultivos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AgregarCultivo')}>
          <Ionicons name="add-circle" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
      >
        <TouchableOpacity 
          style={[styles.filtro, filtro === 'todos' && styles.filtroActivo]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={[styles.filtroTexto, filtro === 'todos' && styles.filtroTextoActivo]}>
            Todos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtro, filtro === 'saludable' && styles.filtroActivo]}
          onPress={() => setFiltro('saludable')}
        >
          <View style={[styles.estadoIndicator, { backgroundColor: '#4CAF50' }]} />
          <Text style={[styles.filtroTexto, filtro === 'saludable' && styles.filtroTextoActivo]}>
            Saludables
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtro, filtro === 'en-riesgo' && styles.filtroActivo]}
          onPress={() => setFiltro('en-riesgo')}
        >
          <View style={[styles.estadoIndicator, { backgroundColor: '#FFC107' }]} />
          <Text style={[styles.filtroTexto, filtro === 'en-riesgo' && styles.filtroTextoActivo]}>
            En Riesgo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtro, filtro === 'enfermo' && styles.filtroActivo]}
          onPress={() => setFiltro('enfermo')}
        >
          <View style={[styles.estadoIndicator, { backgroundColor: '#F44336' }]} />
          <Text style={[styles.filtroTexto, filtro === 'enfermo' && styles.filtroTextoActivo]}>
            Enfermos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filtro, filtro === 'cosechado' && styles.filtroActivo]}
          onPress={() => setFiltro('cosechado')}
        >
          <View style={[styles.estadoIndicator, { backgroundColor: '#9E9E9E' }]} />
          <Text style={[styles.filtroTexto, filtro === 'cosechado' && styles.filtroTextoActivo]}>
            Cosechados
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Mapa de cultivos (vista de cuadrícula) */}
      <ScrollView style={styles.cultivosGrid}>
        <View style={styles.gridContainer}>
          {cultivosFiltrados.map(cultivo => (
            <TouchableOpacity 
              key={cultivo.id}
              style={styles.cultivoCard}
              onPress={() => navigation.navigate('DetalleCultivo', { cultivo })}
            >
              <View style={styles.cultivoHeader}>
  <View
    style={[
      styles.estadoCultivo,
      { backgroundColor: getColorByEstado(cultivo.estado) }
    ]}
  />
  <Ionicons
    name={getIconByTipo(cultivo.tipo)}
    size={24}
    color={getColorByEstado(cultivo.estado)}
  />
</View>

              
              <Text style={styles.cultivoNombre}>{cultivo.nombre}</Text>
              <Text style={styles.cultivoTipo}>{cultivo.tipo}</Text>
              
              <View style={styles.cultivoInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="location" size={16} color="#757575" />
                  <Text style={styles.infoTexto}>{cultivo.ubicacion}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Ionicons name="resize" size={16} color="#757575" />
                  <Text style={styles.infoTexto}>{cultivo.area} ha</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtro: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
  },
  filtroActivo: {
    backgroundColor: '#E8F5E9',
  },
  filtroTexto: {
    color: '#757575',
    fontWeight: '500',
    marginLeft: 4,
  },
  filtroTextoActivo: {
    color: '#4CAF50',
  },
  estadoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cultivosGrid: {
    flex: 1,
    padding: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cultivoCard: {
    width: (Dimensions.get('window').width - 32) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cultivoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estadoCultivo: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  cultivoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cultivoTipo: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  cultivoInfo: {
    marginTop: 'auto',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoTexto: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
});

export default CultivosScreen;