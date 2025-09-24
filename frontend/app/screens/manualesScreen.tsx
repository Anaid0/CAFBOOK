import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostsByCategoryId } from "../../apis/postsApi";
import { Ionicons } from "@expo/vector-icons";

const ManualesScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
  const [manuales, setManuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const categoriaId = 2; // Categoría de manuales

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(Number(id));
    };

    const fetchManuales = async () => {
      try {
        const data = await getPostsByCategoryId(categoriaId);
        setManuales(data);
      } catch (error) {
        console.error("Error cargando manuales:", error);
        Alert.alert("Error", "No se pudieron cargar los manuales");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchManuales();
  }, [route.params?.refresh]);

  const goToManualDetail = async (manualId: number, manualUserId: number) => {
    if (!userId) return Alert.alert("Error", "No se encontró el ID de usuario");

    try {
      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("postId", String(manualId));
      await AsyncStorage.setItem("manualUserId", String(manualUserId));

      navigation.navigate("ManualDetailScreen", { postId: manualId, userId });
    } catch (error) {
      console.error("Error guardando IDs:", error);
      Alert.alert("Error", "No se pudieron guardar los datos para el manual");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando manuales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manuales</Text>
        <Text style={styles.headerSubtitle}>{manuales.length} manuales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        {manuales.map((manual) => (
          <TouchableOpacity
            key={manual.post_id}
            style={styles.manualCard}
            onPress={() => goToManualDetail(manual.post_id, manual.user_id)} 
          >
            <View style={styles.manualHeader}>
              <Text style={styles.manualCategoria}>
                {manual.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.manualFecha}>{manual.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.manualUser}>{manual.user_email}</Text>
            
            <Text style={styles.manualTitulo}>{manual.tittle}</Text>
            <Text style={styles.manualDescripcion}>{manual.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => navigation.navigate("agregarScreen")}
      >
        <Text style={styles.crearButtonText}>+ Crear Nuevo Manual</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: "#FFFFFF", opacity: 0.9 },
  scrollView: { padding: 15, flex: 1 },
  manualCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 15, marginBottom: 15 },
  manualHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  manualCategoria: { fontSize: 12, fontWeight: "600", color: "#1ABC9C", backgroundColor: "#E8F8F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  manualFecha: { fontSize: 12, color: "#7F8C8D" },
  manualUser: { fontSize: 12, fontWeight: "600", color: "#7F8C8D", marginBottom: 5 },
  manualTitulo: { fontSize: 16, fontWeight: "600", color: "#1C2833", marginBottom: 5, lineHeight: 22 },
  manualDescripcion: { fontSize: 14, color: "#34495E", marginBottom: 10 },
  crearButton: { backgroundColor: "#1ABC9C", padding: 15, margin: 15, borderRadius: 8, alignItems: "center" },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default ManualesScreen;
