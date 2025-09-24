import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPostsByCategoryId } from "../../apis/postsApi";

const ManualesScreen = ({ userId }: { userId: number }) => {
  const navigation = useNavigation<any>();
  const [manuales, setManuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriaId = 2;

  useEffect(() => {
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

    fetchManuales();
  }, []);

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
        {manuales.map((manual) => (
          <TouchableOpacity
            key={manual.post_id}
            style={styles.manualCard}
            onPress={() => navigation.navigate("ManualDetailScreen", { manual, userId })}
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
