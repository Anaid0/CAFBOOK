// app/screens/MisManualesScreen.tsx
import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getPostsByUserIdAndCategoryId, deletePost, restorePost } from "../../apis/postsApi";

const MisManualesScreen = () => {
  const navigation = useNavigation<any>();
  const [manuales, setManuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriaId = 2;

  useEffect(() => {
    const fetchManuales = async () => {
      try {
        const id = await AsyncStorage.getItem("userId"); 
        if (!id) return;

        const data = await getPostsByUserIdAndCategoryId(Number(id), categoriaId);
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

  const handleEditar = (id: number) => {
    navigation.navigate("EditarPostScreen", { id });
  };

  const handleEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Manual",
      "¿Estás seguro de que quieres eliminar este manual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deletePost(id);
              setManuales(prev =>
                prev.map(m =>
                  m.post_id === id ? { ...m, status: 0, deleted_at: new Date().toISOString() } : m
                )
              );
              Alert.alert("Éxito", "Manual eliminado correctamente");
            } catch (error) {
              console.error("Error eliminando manual:", error);
              Alert.alert("Error", "No se pudo eliminar el manual");
            }
          }
        }
      ]
    );
  };

  const handleRestaurar = (id: number) => {
    Alert.alert(
      "Restaurar manual",
      "¿Deseas restaurar este manual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          onPress: async () => {
            try {
              await restorePost(id);
              setManuales(prev =>
                prev.map(m =>
                  m.post_id === id ? { ...m, status: 1, deleted_at: null } : m
                )
              );
              Alert.alert("Éxito", "Manual restaurado correctamente");
            } catch (error) {
              console.error("Error restaurando manual:", error);
              Alert.alert("Error", "No se pudo restaurar el manual");
            }
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Mis manuales</Text>
        <Text style={styles.headerSubtitle}>{manuales.length} manuales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#1C2833" />
                  <Text style={styles.backButtonText}>Atrás</Text>
                </TouchableOpacity>
        {manuales.map((manual) => (
          <View key={manual.post_id} style={styles.manualCard}>
            <View style={styles.manualHeader}>
              <Text style={styles.manualCategoria}>
                {manual.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.manualFecha}>{manual.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.manualFecha}>{manual.user_email}</Text>

            {manual.status === 0 && (
              <Text style={[styles.manualFecha, { color: "red", fontWeight: "bold" }]}>
                ELIMINADO {manual.deleted_at ? `- ${manual.deleted_at}` : ""}
              </Text>
            )}

            <Text style={styles.manualTitulo}>{manual.tittle}</Text>
            <Text style={styles.manualTitulo}>{manual.description}</Text>

            <View style={styles.actionsContainer}>
              {manual.status === 1 ? (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editarButton]}
                    onPress={() => handleEditar(manual.post_id)}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, styles.eliminarButton]}
                    onPress={() => handleEliminar(manual.post_id)}
                  >
                    <Text style={styles.actionButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: "#27AE60" }]}
                  onPress={() => handleRestaurar(manual.post_id)}
                >
                  <Text style={styles.actionButtonText}>Restaurar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => navigation.navigate("agregarScreen")}
      >
        <Text style={styles.crearButtonText}>+ Crear Nuevo manual</Text>
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
  manualCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  manualHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  manualCategoria: { fontSize: 12, fontWeight: "600", color: "#1ABC9C", backgroundColor: "#E8F8F5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  manualFecha: { fontSize: 12, color: "#7F8C8D" },
  manualTitulo: { fontSize: 16, fontWeight: "600", color: "#1C2833", marginBottom: 15, lineHeight: 22 },
  actionsContainer: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  editarButton: { backgroundColor: "#3498DB" },
  eliminarButton: { backgroundColor: "#E74C3C" },
  actionButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  crearButton: { backgroundColor: "#1ABC9C", padding: 15, margin: 15, borderRadius: 8, alignItems: "center" },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default MisManualesScreen;
