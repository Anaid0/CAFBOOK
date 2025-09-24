import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserPhones, deleteUserPhone } from "../../apis/usersPhonesApi";

const TelefonosScreen = () => {
  const navigation = useNavigation<any>();
  const [telefonos, setTelefonos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserPhones = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          Alert.alert("Error", "Usuario no autenticado");
          return;
        }
        setUserId(Number(storedUserId));

        const phones = await getUserPhones();
        const userPhones = phones.filter((p: any) => p.user_id === Number(storedUserId));
        setTelefonos(userPhones);
      } catch (error) {
        console.error("Error cargando teléfonos:", error);
        Alert.alert("Error", "No se pudieron cargar los teléfonos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhones();
  }, []);

  const handleEliminar = (userPhoneId: number) => {
    Alert.alert("Eliminar Teléfono", "¿Estás seguro de que quieres eliminar este teléfono?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserPhone(userPhoneId);
            setTelefonos((prev) => prev.filter((t) => t.user_phone_id !== userPhoneId));
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando teléfonos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Teléfonos</Text>
        <Text style={styles.headerSubtitle}>{telefonos.length} teléfonos registrados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        {telefonos.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No tienes teléfonos registrados</Text>
        )}

        {telefonos.map((t) => (
          <View key={t.user_phone_id} style={styles.phoneCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneNumber}>{t.phone.number}</Text>
              <Text style={styles.phoneType}>{t.phone_type.description}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEliminar(t.user_phone_id)}>
              <Ionicons name="trash" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AgregarTelefonoScreen")}
        >
          <Text style={styles.addButtonText}>+ Agregar Teléfono</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: "#FFFFFF", opacity: 0.9 },
  scrollView: { padding: 15, flex: 1 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backButtonText: { fontSize: 16, color: "#1C2833", marginLeft: 5, fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  phoneCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneNumber: { fontSize: 16, fontWeight: "600", color: "#1C2833" },
  phoneType: { fontSize: 14, color: "#7F8C8D", marginTop: 3 },
  addButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default TelefonosScreen;
