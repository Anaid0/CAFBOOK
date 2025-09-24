import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, 
  ActivityIndicator, Alert, TextInput, Modal, KeyboardAvoidingView, Platform,
  RefreshControl
} from 'react-native';
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCrops, createCrop, updateCropEstado, deleteCrop, updateCrop } from '../../apis/cropsApi';
import { getAllCropTypes } from '../../apis/cropTypesApi';

// Interfaces mejoradas basadas en tu backend
type EstadoCultivo = 'saludable' | 'en-riesgo' | 'enfermo' | 'cosechado';

interface CropType {
  crop_type_id: number;
  crop_type_description: string;
}

interface Cultivo {
  crop_id: number;
  user_id: number;
  user_email: string;
  crop_type_id: number;
  crop_type_description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  estado?: EstadoCultivo;
  notes?: string;
}

interface FormData {
  crop_type_id: number;
  crop_type_description: string;
  latitude: number;
  longitude: number;
  notes: string;
  estado: EstadoCultivo;
  user_id?: number;
}

type Vista = 'lista' | 'mapa';

// Componente para los filtros
const FiltrosCultivos: React.FC<{
  filtro: string;
  onFiltroChange: (filtro: string) => void;
}> = ({ filtro, onFiltroChange }) => {
  const opcionesFiltro = [
    { key: 'todos', label: 'Todos', color: '#757575' },
    { key: 'saludable', label: 'Saludables', color: '#4CAF50' },
    { key: 'en-riesgo', label: 'En Riesgo', color: '#FFC107' },
    { key: 'enfermo', label: 'Enfermos', color: '#F44336' },
    { key: 'cosechado', label: 'Cosechados', color: '#9E9E9E' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer}>
      {opcionesFiltro.map((opcion) => (
        <TouchableOpacity 
          key={opcion.key}
          style={[styles.filtro, filtro === opcion.key && styles.filtroActivo]} 
          onPress={() => onFiltroChange(opcion.key)}
        >
          {opcion.key !== 'todos' && (
            <View style={[styles.estadoIndicator, { backgroundColor: opcion.color }]} />
          )}
          <Text style={[styles.filtroTexto, filtro === opcion.key && styles.filtroTextoActivo]}>
            {opcion.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Componente para el modal de cultivo
const ModalCultivo: React.FC<{
  visible: boolean;
  mode: 'agregar' | 'editar';
  cultivoSeleccionado: Cultivo | null;
  cropTypes: CropType[];
  formData: FormData;
  region: Region;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (field: keyof FormData, value: any) => void;
  onMapPress: (event: any) => void;
  onRegionChange: (region: Region) => void;
  userId: number | null;
}> = ({ 
  visible, mode, cultivoSeleccionado, cropTypes, formData, region, loading,
  onClose, onSubmit, onFormChange, onMapPress, onRegionChange, userId 
}) => {
  const getColorByEstado = (estado?: string) => {
    switch (estado) {
      case 'saludable': return '#4CAF50';
      case 'en-riesgo': return '#FFC107';
      case 'enfermo': return '#F44336';
      case 'cosechado': return '#9E9E9E';
      default: return '#757575';
    }
  };

  // Obtener el nombre del tipo de cultivo seleccionado
  const getSelectedCropTypeName = () => {
    if (formData.crop_type_id === 0) return 'Ninguno seleccionado';
    const selectedType = cropTypes.find(type => type.crop_type_id === formData.crop_type_id);
    return selectedType ? selectedType.crop_type_description : 'Tipo no encontrado';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {mode === 'agregar' ? 'Agregar Cultivo' : 'Editar Cultivo'}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {userId && (
              <Text style={styles.userInfo}>
                Creando cultivo para el usuario ID: {userId}
              </Text>
            )}
            
            <Text style={styles.label}>Tipo de Cultivo:</Text>
            
            {/* Mostrar el tipo de cultivo seleccionado */}
            <View style={styles.selectedCropTypeContainer}>
              <Text style={styles.selectedCropTypeLabel}>Seleccionado:</Text>
              <Text style={styles.selectedCropTypeText}>
                {getSelectedCropTypeName()}
              </Text>
            </View>

            <Text style={styles.subLabel}>Selecciona un tipo:</Text>
            <View style={styles.cropTypeContainer}>
              {cropTypes.map((type) => (
                <TouchableOpacity
                  key={type.crop_type_id}
                  style={[
                    styles.cropTypeButton,
                    formData.crop_type_id === type.crop_type_id && styles.cropTypeButtonActive
                  ]}
                  onPress={() => {
                    onFormChange('crop_type_id', type.crop_type_id);
                    onFormChange('crop_type_description', type.crop_type_description);
                  }}
                >
                  <Text style={[
                    styles.cropTypeButtonText,
                    formData.crop_type_id === type.crop_type_id && styles.cropTypeButtonTextActive
                  ]}>
                    {type.crop_type_description}
                  </Text>
                  {formData.crop_type_id === type.crop_type_id && (
                    <Ionicons name="checkmark" size={16} color="#FFF" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notas (opcional)"
              value={formData.notes}
              onChangeText={(text) => onFormChange('notes', text)}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Seleccionar estado:</Text>
            <View style={styles.estadoButtons}>
              {['saludable', 'en-riesgo', 'enfermo', 'cosechado'].map(estado => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    styles.estadoButton,
                    formData.estado === estado && styles.estadoButtonActive,
                    { backgroundColor: getColorByEstado(estado) }
                  ]}
                  onPress={() => onFormChange('estado', estado)}
                >
                  <Text style={styles.estadoButtonText}>
                    {estado.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                  {formData.estado === estado && (
                    <Ionicons name="checkmark" size={14} color="#FFF" style={styles.estadoCheckIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Seleccionar ubicación en el mapa:</Text>
            <View style={styles.miniMapaContainer}>
              <MapView
                style={styles.miniMapa}
                provider={PROVIDER_GOOGLE}
                region={region}
                onPress={onMapPress}
                onRegionChangeComplete={onRegionChange}
              >
                <Marker
                  coordinate={{ latitude: formData.latitude, longitude: formData.longitude }}
                >
                  <View style={styles.customMarker}>
                    <Ionicons name="location" size={24} color="#4CAF50" />
                  </View>
                </Marker>
              </MapView>
              <View style={styles.coordinatesContainer}>
                <Text style={styles.coordinatesText}>
                  Lat: {formData.latitude.toFixed(6)}
                </Text>
                <Text style={styles.coordinatesText}>
                  Lng: {formData.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={onSubmit}
              disabled={loading || !formData.crop_type_id || !userId}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'agregar' ? 'Agregar Cultivo' : 'Actualizar Cultivo'}
                </Text>
              )}
            </TouchableOpacity>
            
            {!userId && (
              <Text style={styles.errorText}>
                Error: No se pudo obtener el ID del usuario. Por favor, cierra sesión y vuelve a iniciar.
              </Text>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const CultivosScreen: React.FC<BottomTabScreenProps<any>> = ({ navigation }) => {
  // Estados principales
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [vistaActual, setVistaActual] = useState<Vista>('lista');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Estados para el usuario
  const [userId, setUserId] = useState<number | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  
  // Estados para modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'agregar' | 'editar'>('agregar');
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState<Cultivo | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Estados para el formulario
  const [formData, setFormData] = useState<FormData>({
    crop_type_id: 0,
    crop_type_description: '',
    latitude: 0,
    longitude: 0,
    notes: '',
    estado: 'saludable'
  });

  // Estados para el mapa
  const [region, setRegion] = useState<Region>({
    latitude: 4.6097,
    longitude: -74.0817,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Estado para la región del mapa principal
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 4.6097,
    longitude: -74.0817,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Obtener datos del usuario desde AsyncStorage
  const obtenerDatosUsuario = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUserToken = await AsyncStorage.getItem('userToken');
      
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      }
      if (storedUserToken) {
        setUserToken(storedUserToken);
      }
      
      console.log('User ID obtenido:', storedUserId);
      console.log('User Token obtenido:', storedUserToken);
      
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      Alert.alert("Error", "No se pudieron cargar los datos del usuario");
    }
  };

  // Obtener tipos de cultivo
  const fetchCropTypes = async () => {
    try {
      const response = await getAllCropTypes();
      if (response.data && Array.isArray(response.data)) {
        setCropTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching crop types:', error);
    }
  };

  // Obtener cultivos del usuario actual
  const fetchCultivos = async () => {
    try {
      setLoading(true);
      const response = await getAllCrops();

      if (response.data && Array.isArray(response.data)) {
        // Filtrar cultivos por el usuario actual
        const cultivosUsuario = response.data.filter((c: any) => 
          userId ? c.user_id === userId : false
        );
        
        const cultivosNumericos: Cultivo[] = cultivosUsuario.map((c: any) => ({
          ...c,
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
          estado: c.estado || 'saludable'
        }));
        
        setCultivos(cultivosNumericos);
        
        // Actualizar la región del mapa principal si hay cultivos
        if (cultivosNumericos.length > 0) {
          const newRegion = getRegionInicial(cultivosNumericos);
          setMapRegion(newRegion);
        }
        
        console.log('Cultivos cargados para el usuario:', userId, cultivosNumericos.length);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
      Alert.alert("Error", "No se pudieron cargar los cultivos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
    fetchCropTypes();
    obtenerUbicacionActual();
  }, []);

  // Recargar cultivos cuando cambie el userId
  useEffect(() => {
    if (userId) {
      fetchCultivos();
    }
  }, [userId]);

  const obtenerUbicacionActual = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setFormData(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  };

  const handleAgregarCultivo = () => {
    if (!userId) {
      Alert.alert("Error", "No se pudo identificar al usuario. Por favor, cierra sesión y vuelve a iniciar.");
      return;
    }
    
    setModalMode('agregar');
    setCultivoSeleccionado(null);
    setFormData({
      crop_type_id: 0,
      crop_type_description: '',
      latitude: region.latitude,
      longitude: region.longitude,
      notes: '',
      estado: 'saludable',
      user_id: userId
    });
    setModalVisible(true);
  };

  const handleEditarCultivo = (cultivo: Cultivo) => {
    setModalMode('editar');
    setCultivoSeleccionado(cultivo);
    setFormData({
      crop_type_id: cultivo.crop_type_id,
      crop_type_description: cultivo.crop_type_description,
      latitude: cultivo.latitude,
      longitude: cultivo.longitude,
      notes: cultivo.notes || '',
      estado: cultivo.estado || 'saludable',
      user_id: userId || undefined
    });
    setRegion({
      latitude: cultivo.latitude,
      longitude: cultivo.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setModalVisible(true);
  };

  const handleEliminarCultivo = (cultivo: Cultivo) => {
    Alert.alert(
      "Eliminar Cultivo",
      `¿Estás seguro de que quieres eliminar ${cultivo.crop_type_description}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCrop(cultivo.crop_id);
              Alert.alert("Éxito", "Cultivo eliminado correctamente");
              fetchCultivos();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el cultivo");
            }
          }
        }
      ]
    );
  };

  const handleCambiarEstado = async (cultivo: Cultivo, nuevoEstado: EstadoCultivo) => {
    try {
      await updateCropEstado(cultivo.crop_id, nuevoEstado);
      Alert.alert("Éxito", "Estado actualizado correctamente");
      fetchCultivos();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "No se pudo identificar al usuario");
      return;
    }

    if (!formData.crop_type_id) {
      Alert.alert("Error", "Debe seleccionar un tipo de cultivo");
      return;
    }

    // Validar coordenadas
    if (Math.abs(formData.latitude) > 90 || Math.abs(formData.longitude) > 180) {
      Alert.alert("Error", "Coordenadas inválidas");
      return;
    }

    setSubmitLoading(true);
    try {
      const cropData = {
        crop_type_id: formData.crop_type_id,
        latitude: formData.latitude,
        longitude: formData.longitude,
        notes: formData.notes,
        estado: formData.estado,
        user_id: userId // ✅ Incluir el user_id en los datos del cultivo
      };

      if (modalMode === 'agregar') {
        await createCrop(cropData);
        Alert.alert("Éxito", "Cultivo agregado correctamente");
      } else {
        if (cultivoSeleccionado) {
          await updateCrop(cultivoSeleccionado.crop_id, cropData);
          Alert.alert("Éxito", "Cultivo actualizado correctamente");
        }
      }
      setModalVisible(false);
      fetchCultivos();
    } catch (error: any) {
      console.error('Error saving crop:', error);
      Alert.alert("Error", error.message || "No se pudo guardar el cultivo");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      Alert.alert("Error", "Coordenadas inválidas");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      latitude,
      longitude
    }));
    setRegion(prev => ({
      ...prev,
      latitude,
      longitude
    }));
  };

  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCultivos();
  }, [userId]);

  // Filtrar cultivos según estado
  const cultivosFiltrados = useMemo(() => {
    return filtro === 'todos'
      ? cultivos
      : cultivos.filter(c => c.estado === filtro);
  }, [cultivos, filtro]);

  const getColorByEstado = (estado?: string) => {
    switch (estado) {
      case 'saludable': return '#4CAF50';
      case 'en-riesgo': return '#FFC107';
      case 'enfermo': return '#F44336';
      case 'cosechado': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getRegionInicial = (cultivosArray: Cultivo[] = cultivosFiltrados) => {
    if (!cultivosArray.length) {
      return { latitude: 4.6097, longitude: -74.0817, latitudeDelta: 0.1, longitudeDelta: 0.1 };
    }

    let minLat = cultivosArray[0].latitude;
    let maxLat = cultivosArray[0].latitude;
    let minLng = cultivosArray[0].longitude;
    let maxLng = cultivosArray[0].longitude;

    cultivosArray.forEach(c => {
      minLat = Math.min(minLat, c.latitude);
      maxLat = Math.max(maxLat, c.latitude);
      minLng = Math.min(minLng, c.longitude);
      maxLng = Math.max(maxLng, c.longitude);
    });

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
    };
  };

  // Función para actualizar el mapa cuando cambian los cultivos
  const actualizarMapa = () => {
    if (cultivosFiltrados.length > 0) {
      const nuevaRegion = getRegionInicial();
      setMapRegion(nuevaRegion);
    }
  };

  // Actualizar el mapa cuando cambian los cultivos filtrados
  useEffect(() => {
    actualizarMapa();
  }, [cultivosFiltrados]);

  const renderVistaLista = () => (
    <ScrollView 
      style={styles.cultivosGrid}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.gridContainer}>
        {cultivosFiltrados.map(cultivo => (
          <TouchableOpacity 
            key={cultivo.crop_id}
            style={styles.cultivoCard}
            onPress={() => handleEditarCultivo(cultivo)}
            onLongPress={() => handleEliminarCultivo(cultivo)}
          >
            <View style={styles.cultivoHeader}>
              <View style={[styles.estadoCultivo, { backgroundColor: getColorByEstado(cultivo.estado) }]} />
              <View style={styles.cultivoActions}>
                <TouchableOpacity onPress={() => handleCambiarEstado(cultivo, 'saludable')}>
                  <Ionicons name="heart" size={16} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCambiarEstado(cultivo, 'en-riesgo')}>
                  <Ionicons name="warning" size={16} color="#FFC107" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCambiarEstado(cultivo, 'enfermo')}>
                  <Ionicons name="medical" size={16} color="#F44336" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCambiarEstado(cultivo, 'cosechado')}>
                  <Ionicons name="checkmark-done" size={16} color="#9E9E9E" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cultivoNombre}>{cultivo.crop_type_description}</Text>
            <Text style={styles.cultivoTipo}>ID: {cultivo.crop_id}</Text>
            <Text style={styles.cultivoEstado}>
              Estado: {cultivo.estado?.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
            {cultivo.notes && <Text style={styles.cultivoNotes}>{cultivo.notes}</Text>}
            <Text style={styles.cultivoFecha}>
              Creado: {new Date(cultivo.created_at).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderVistaMapa = () => (
    <View style={styles.mapaContainer}>
      <MapView
        style={styles.mapa}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
      >
        {cultivosFiltrados.map(c => (
          <Marker
            key={c.crop_id}
            coordinate={{ latitude: c.latitude, longitude: c.longitude }}
            title={c.crop_type_description}
            description={`Estado: ${c.estado}`}
            onPress={() => handleEditarCultivo(c)}
          >
            <View style={[styles.marcador, { backgroundColor: getColorByEstado(c.estado) }]}>
              <Ionicons name="leaf" size={16} color="#FFF" />
            </View>
          </Marker>
        ))}
      </MapView>
      
      {/* Botón para centrar el mapa en los cultivos */}
      {cultivosFiltrados.length > 0 && (
        <TouchableOpacity 
          style={styles.centrarMapaButton}
          onPress={actualizarMapa}
        >
          <Ionicons name="locate" size={20} color="#4CAF50" />
          <Text style={styles.centrarMapaText}>Centrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando cultivos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis Cultivos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setVistaActual(vistaActual === 'lista' ? 'mapa' : 'lista')}
            style={styles.vistaButton}
          >
            <Ionicons 
              name={vistaActual === 'lista' ? 'map' : 'list'} 
              size={24} 
              color="#4CAF50" 
            />
            <Text style={styles.vistaButtonText}>
              {vistaActual === 'lista' ? 'Mapa' : 'Lista'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAgregarCultivo} style={styles.agregarButton}>
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.agregarButtonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FiltrosCultivos filtro={filtro} onFiltroChange={setFiltro} />

      {cultivosFiltrados.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={64} color="#E0E0E0" />
          <Text style={styles.emptyStateText}>
            {userId ? 'No hay cultivos registrados' : 'No se pudo cargar la información del usuario'}
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={handleAgregarCultivo}>
            <Text style={styles.emptyStateButtonText}>
              {userId ? 'Agregar primer cultivo' : 'Reintentar'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : vistaActual === 'lista' ? renderVistaLista() : renderVistaMapa()}

      <ModalCultivo
        visible={modalVisible}
        mode={modalMode}
        cultivoSeleccionado={cultivoSeleccionado}
        cropTypes={cropTypes}
        formData={formData}
        region={region}
        loading={submitLoading}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        onMapPress={handleMapPress}
        onRegionChange={setRegion}
        userId={userId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    elevation: 2 
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vistaButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vistaButtonText: { color: '#4CAF50', fontWeight: '500' },
  agregarButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#4CAF50', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  agregarButtonText: { color: '#FFF', fontWeight: '500' },
  
  filtrosContainer: { 
    flexDirection: 'row', 
    paddingVertical: 12, 
    paddingHorizontal: 8, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0' 
  },
  filtro: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginHorizontal: 4, 
    backgroundColor: '#F5F5F5' 
  },
  filtroActivo: { backgroundColor: '#E8F5E9' },
  filtroTexto: { color: '#757575', fontWeight: '500', marginLeft: 4 },
  filtroTextoActivo: { color: '#4CAF50' },
  estadoIndicator: { width: 12, height: 12, borderRadius: 6 },
  
  cultivosGrid: { flex: 1, padding: 8 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cultivoCard: { 
    width: (Dimensions.get('window').width - 32) / 2, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 16, 
    elevation: 2 
  },
  cultivoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  cultivoActions: { flexDirection: 'row', gap: 4 },
  estadoCultivo: { width: 16, height: 16, borderRadius: 8 },
  cultivoNombre: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cultivoTipo: { fontSize: 12, color: '#757575', marginBottom: 2 },
  cultivoEstado: { fontSize: 12, color: '#999', marginBottom: 4 },
  cultivoNotes: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 4 },
  cultivoFecha: { fontSize: 10, color: '#999' },
  
  mapaContainer: { flex: 1, position: 'relative' },
  mapa: { flex: 1 },
  marcador: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  centrarMapaButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  centrarMapaText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 12,
  },
  
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40 
  },
  emptyStateText: { 
    fontSize: 18, 
    color: '#999', 
    marginTop: 16, 
    textAlign: 'center' 
  },
  emptyStateButton: { 
    marginTop: 20, 
    backgroundColor: '#4CAF50', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 6 
  },
  emptyStateButtonText: { 
    color: 'white', 
    fontWeight: '600' 
  },
  
 // Modal Styles Mejorados
modalContainer: { 
  flex: 1, 
  justifyContent: 'flex-end', 
  backgroundColor: 'rgba(0,0,0,0.5)' 
},
modalContent: { 
  backgroundColor: '#FFF', 
  borderTopLeftRadius: 20, 
  borderTopRightRadius: 20, 
  maxHeight: '90%' 
},
modalHeader: { 
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  padding: 16, 
  borderBottomWidth: 1, 
  borderBottomColor: '#E0E0E0' 
},
modalTitle: { 
  fontSize: 20, 
  fontWeight: 'bold', 
  color: '#333' 
},
modalBody: { padding: 16 },

userInfo: {
  fontSize: 14,
  fontWeight: '600',
  color: '#4CAF50',
  textAlign: 'center',
  marginBottom: 16,
  paddingVertical: 8,
  backgroundColor: '#E8F5E9',
  borderRadius: 8
},

label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 12 },
subLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
input: { 
  fontSize: 14,
  borderWidth: 1, 
  borderColor: '#CCC', 
  borderRadius: 8, 
  paddingHorizontal: 12, 
  paddingVertical: 8, 
  marginBottom: 12,
  backgroundColor: '#FAFAFA'
},
textArea: { minHeight: 60, textAlignVertical: 'top' },

cropTypeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
cropTypeButton: { 
  flexDirection: 'row', 
  alignItems: 'center',
  paddingHorizontal: 12, 
  paddingVertical: 6, 
  borderRadius: 16, 
  marginRight: 8, 
  marginBottom: 8, 
  backgroundColor: '#E0E0E0'
},
cropTypeButtonActive: { backgroundColor: '#4CAF50' },
cropTypeButtonText: { fontSize: 12, color: '#333' },
cropTypeButtonTextActive: { fontSize: 12, fontWeight: '600', color: '#FFF' },
checkIcon: { marginLeft: 4 },

selectedCropTypeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
selectedCropTypeLabel: { fontSize: 12, color: '#757575', marginRight: 4 },
selectedCropTypeText: { fontSize: 12, fontWeight: '600', color: '#4CAF50' },

estadoButtons: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
estadoButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
estadoButtonActive: { opacity: 0.9 },
estadoButtonText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
estadoCheckIcon: { marginLeft: 4 },

miniMapaContainer: { height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
miniMapa: { flex: 1 },
customMarker: { justifyContent: 'center', alignItems: 'center' },
coordinatesContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: 'rgba(255,255,255,0.9)' },
coordinatesText: { fontSize: 10, color: '#333' },

submitButton: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
submitButtonDisabled: { backgroundColor: '#A5D6A7' },
submitButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },

errorText: { color: '#F44336', fontSize: 12, marginTop: 8, textAlign: 'center' }

});

export default CultivosScreen;