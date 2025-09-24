import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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

  const categoriaId = 2;

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

  const goToManualDetail = (manualId: number) => {
    if (!userId) return Alert.alert("Error", "No se encontró el ID de usuario");
    navigation.navigate("ManualDetailScreen", { postId: manualId, userId });
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
            onPress={() => goToManualDetail(manual.post_id)}
          >
            <Text style={styles.manualTitulo}>{manual.tittle}</Text>
            <Text style={styles.manualDescripcion}>{manual.description}</Text>
            <Text style={styles.manualUser}>{manual.user_email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  manualTitulo: { fontSize: 16, fontWeight: "600", color: "#1C2833", marginBottom: 5 },
  manualDescripcion: { fontSize: 14, color: "#34495E", marginBottom: 5 },
  manualUser: { fontSize: 12, fontWeight: "600", color: "#7F8C8D" },
});

export default ManualesScreen;
