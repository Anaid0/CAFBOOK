import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getPostsByCategoryId } from "../../apis/postsApi";

const ForosScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [foros, setForos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const categoriaId = 3; // Categoría de foros

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(Number(id));
    };

    const fetchForos = async () => {
      try {
        const data = await getPostsByCategoryId(categoriaId);
        setForos(data);
      } catch (error) {
        console.error("Error cargando foros:", error);
        Alert.alert("Error", "No se pudieron cargar los foros");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchForos();
  }, [route.params?.refresh]);

  const goToForoDetail = async (foroId: number, foroUserId: number) => {
    if (!userId) return Alert.alert("Error", "No se encontró el ID de usuario");

    try {
      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("postId", String(foroId));
      await AsyncStorage.setItem("foroUserId", String(foroUserId));

      navigation.navigate("ForoDetailScreen", { postId: foroId, userId });
    } catch (error) {
      console.error("Error guardando IDs:", error);
      Alert.alert("Error", "No se pudieron guardar los datos para el foro");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando foros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Foros</Text>
        <Text style={styles.headerSubtitle}>{foros.length} foros creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        {foros.map((foro) => (
          <TouchableOpacity
            key={foro.post_id}
            style={styles.foroCard}
            onPress={() => goToForoDetail(foro.post_id, foro.user_id)}
          >
            <View style={styles.foroHeader}>
              <Text style={styles.foroCategoria}>
                {foro.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.foroFecha}>{foro.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.foroUser}>{foro.user_email}</Text>
            
            <Text style={styles.foroTitulo}>{foro.tittle}</Text>
            <Text style={styles.foroDescripcion}>{foro.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => navigation.navigate("agregarScreen")}
      >
        <Text style={styles.crearButtonText}>+ Crear Nuevo Foro</Text>
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
  foroCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 15, marginBottom: 15 },
  foroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  foroCategoria: { fontSize: 12, fontWeight: "600", color: "#1ABC9C", backgroundColor: "#E8F8F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  foroFecha: { fontSize: 12, color: "#7F8C8D" },
  foroUser: { fontSize: 12, fontWeight: "600", color: "#7F8C8D", marginBottom: 5 },
  foroTitulo: { fontSize: 16, fontWeight: "600", color: "#1C2833", marginBottom: 5, lineHeight: 22 },
  foroDescripcion: { fontSize: 14, color: "#34495E", marginBottom: 10 },
  crearButton: { backgroundColor: "#1ABC9C", padding: 15, margin: 15, borderRadius: 8, alignItems: "center" },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default ForosScreen;
