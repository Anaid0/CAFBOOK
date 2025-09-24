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
import { getPostsByCategoryId } from "../../apis/postsApi"; 
import { Ionicons } from "@expo/vector-icons";

const TutorialesScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [tutoriales, setTutoriales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const categoriaId = 1; 

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(Number(id));
    };

    const fetchTutoriales = async () => {
      try {
        const data = await getPostsByCategoryId(categoriaId);
        setTutoriales(data);
      } catch (error) {
        console.error("Error cargando tutoriales:", error);
        Alert.alert("Error", "No se pudieron cargar los tutoriales");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchTutoriales();
  }, [route.params?.refresh]);

  const goToTutorialDetail = async (tutorialId: number, tutorialUserId: number) => {
    if (!userId) return Alert.alert("Error", "No se encontró el ID de usuario");

    try {
      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("postId", String(tutorialId));
      await AsyncStorage.setItem("tutorialUserId", String(tutorialUserId));

      navigation.navigate("TutorialDetailScreen", { postId: tutorialId, userId });
    } catch (error) {
      console.error("Error guardando IDs:", error);
      Alert.alert("Error", "No se pudieron guardar los datos para el tutorial");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando tutoriales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutoriales</Text>
        <Text style={styles.headerSubtitle}>{tutoriales.length} tutoriales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        {tutoriales.map((tutorial) => (
          <TouchableOpacity
            key={tutorial.post_id}
            style={styles.tutorialCard}
            onPress={() => goToTutorialDetail(tutorial.post_id, tutorial.user_id)}
          >
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialCategoria}>
                {tutorial.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.tutorialFecha}>{tutorial.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.tutorialUser}>{tutorial.user_email}</Text>
            
            <Text style={styles.tutorialTitulo}>{tutorial.tittle}</Text>
            <Text style={styles.tutorialDescripcion}>{tutorial.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => navigation.navigate("agregarScreen")}
      >
        <Text style={styles.crearButtonText}>+ Crear Nuevo Tutorial</Text>
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
  tutorialCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 15, marginBottom: 15 },
  tutorialHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  tutorialCategoria: { fontSize: 12, fontWeight: "600", color: "#1ABC9C", backgroundColor: "#E8F8F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tutorialFecha: { fontSize: 12, color: "#7F8C8D" },
  tutorialUser: { fontSize: 12, fontWeight: "600", color: "#7F8C8D", marginBottom: 5 },
  tutorialTitulo: { fontSize: 16, fontWeight: "600", color: "#1C2833", marginBottom: 5, lineHeight: 22 },
  tutorialDescripcion: { fontSize: 14, color: "#34495E", marginBottom: 10 },
  crearButton: { backgroundColor: "#1ABC9C", padding: 15, margin: 15, borderRadius: 8, alignItems: "center" },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default TutorialesScreen;
