// app/screens/MisTelefonosScreen.tsx
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
import { getPhones, deletePhone } from "../../apis/phonesApi";

const MisTelefonosScreen = () => {
  const navigation = useNavigation<any>();
  const [telefonos, setTelefonos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelefonos = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;

        const data = await getPhones();
        setTelefonos(data);
      } catch (error) {
        console.error("Error cargando teléfonos:", error);
        Alert.alert("Error", "No se pudieron cargar los teléfonos");
      } finally {
        setLoading(false);
      }
    };

    fetchTelefonos();
  }, []);

  const handleEliminar = (id: number) => {
    Alert.alert("Eliminar Teléfono", "¿Estás seguro de que quieres eliminar este teléfono?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deletePhone(id);
            setTelefonos((prev) => prev.filter((t) => t.phone_id !== id));
            Alert.alert("Éxito", "Teléfono eliminado correctamente");
          } catch (error) {
            console.error("Error eliminando teléfono:", error);
            Alert.alert("Error", "No se pudo eliminar el teléfono");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando teléfonos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis teléfonos</Text>
        <Text style={styles.headerSubtitle}>{telefonos.length} teléfonos guardados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {telefonos.map((tel) => (
          <View key={tel.phone_id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategoria}>
                {tel.number_type?.description || "Sin tipo"}
              </Text>
              <Text style={styles.cardFecha}>{tel.number}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(tel.phone_id)}
              >
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.crearButton}
        onPress={() => navigation.navigate("AgregarTelefonoScreen")}
      >
        <Text style={styles.crearButtonText}>+ Agregar Teléfono</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 5 },
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
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
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
  actionsContainer: { flexDirection: "row", justifyContent: "flex-end" },
  actionButton: { padding: 10, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
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

export default MisTelefonosScreen;
