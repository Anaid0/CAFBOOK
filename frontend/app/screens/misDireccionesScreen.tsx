// app/screens/MisDireccionesScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllAddresses, deleteAddress } from "../../apis/addressesApi";

const MisDireccionesScreen = () => {
  const navigation = useNavigation<any>();
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;

        const res = await getAllAddresses();
        setDirecciones(res.data);
      } catch (error) {
        console.error("Error cargando direcciones:", error);
        Alert.alert("Error", "No se pudieron cargar las direcciones");
      } finally {
        setLoading(false);
      }
    };

    fetchDirecciones();
  }, []);

  const handleEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Dirección",
      "¿Estás seguro de que quieres eliminar esta dirección?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteAddress(id);
              setDirecciones((prev) =>
                prev.filter((d) => d.address_id !== id)
              );
              Alert.alert("Éxito", "Dirección eliminada correctamente");
            } catch (error) {
              console.error("Error eliminando dirección:", error);
              Alert.alert("Error", "No se pudo eliminar la dirección");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando direcciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis direcciones</Text>
        <Text style={styles.headerSubtitle}>
          {direcciones.length} direcciones guardadas
        </Text>
      </View>

      {/* Lista */}
      <ScrollView style={styles.scrollView}>
        {direcciones.map((dir) => (
          <View key={dir.address_id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategoria}>
                {dir.city_name || "Sin ciudad"}
              </Text>
              <Text style={styles.cardFecha}>
                {dir.postal_code || "Sin código postal"}
              </Text>
            </View>

            <Text style={styles.cardDetalle}>{dir.street}</Text>
            {dir.vereda && (
              <Text style={styles.cardDetalle}>Vereda: {dir.vereda}</Text>
            )}

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(dir.address_id)}
              >
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón agregar */}
      <TouchableOpacity
        style={styles.crearButton}
        onPress={() => navigation.navigate("AgregarDireccionScreen")}
      >
        <Text style={styles.crearButtonText}>+ Agregar Dirección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, paddingTop: 50 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: { fontSize: 14, color: "#FFFFFF", opacity: 0.9 },
  scrollView: { padding: 15, flex: 1 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardCategoria: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1ABC9C",
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardFecha: { fontSize: 14, color: "#7F8C8D" },
  cardDetalle: {
    fontSize: 14,
    color: "#1C2833",
    marginBottom: 5,
  },
  actionsContainer: { flexDirection: "row", justifyContent: "flex-end" },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  eliminarButton: { backgroundColor: "#E74C3C" },
  actionButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  crearButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default MisDireccionesScreen;
