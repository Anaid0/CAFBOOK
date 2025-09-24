// app/screens/MismuroScreen.tsx
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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostsByUserIdAndCategoryId, deletePost, restorePost } from "../../apis/postsApi"; 

const MiMuroScreen = () => {
  const navigation = useNavigation<any>();
  const [muro, setMuro] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoriaId = 4;
  useEffect(() => {
    const fetchmuro = async () => {
      try {
        const id = await AsyncStorage.getItem("userId"); 
        if (!id) return;

        const data = await getPostsByUserIdAndCategoryId(Number(id), categoriaId);
        setMuro(data);
      } catch (error) {
        console.error("Error cargando muro:", error);
        Alert.alert("Error", "No se pudo cargar el muro");
      } finally {
        setLoading(false);
      }
    };

    fetchmuro();
  }, []);

  const handleEditar = (id: number) => {
    navigation.navigate("EditarPostScreen", { id });
  };

const handleEliminar = (id: number) => {
  Alert.alert(
    "Eliminar muro",
    "¿Estás seguro de que quieres eliminar este muro?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        onPress: async () => {
          try {
            await deletePost(id);
            setMuro((prev) => prev.filter((t) => t.post_id !== id));
            Alert.alert("Éxito", "Publicación eliminada correctamente");
          } catch (error) {
            console.error("Error eliminando publicación:", error);
            Alert.alert("Error", "No se pudo eliminar la publicación");
          }
        },
      },
    ]
  );
};

const handleRestaurar = (id: number) => {
  Alert.alert(
    "Restaurar publicación",
    "¿Deseas restaurar esta publicación?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Restaurar",
        onPress: async () => {
          try {
            await restorePost(id);
            setMuro((prev) =>
              prev.map((p) =>
                p.post_id === id ? { ...p, status: 1, deleted_at: null } : p
              )
            );
            Alert.alert("Éxito", "Publicación restaurada correctamente");
          } catch (error) {
            console.error("Error restaurando publicación:", error);
            Alert.alert("Error", "No se pudo restaurar la publicación");
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
        <Text>Cargando muro...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi muro</Text>
        <Text style={styles.headerSubtitle}>{muro.length} muro creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {muro.map((muro) => (
  <View key={muro.post_id} style={styles.muroCard}>
    <View style={styles.muroHeader}>
      <Text style={styles.muroCategoria}>
        {muro.post_category_description || "Sin categoría"}
      </Text>
      <Text style={styles.muroFecha}>{muro.created_at || "Sin fecha"}</Text>
    </View>

    <Text style={styles.muroFecha}>{muro.user_email}</Text>

    {muro.status === 0 && (
      <Text style={[styles.muroFecha, { color: "red", fontWeight: "bold" }]}>
        ELIMINADO {muro.deleted_at ? `- ${muro.deleted_at}` : ""}
      </Text>
    )}

    <Text style={styles.muroTitulo}>{muro.tittle}</Text>
    <Text style={styles.muroTitulo}>{muro.description}</Text>

    <View style={styles.actionsContainer}>
      {muro.status === 1 ? (
        <>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editarButton]}
            onPress={() => handleEditar(muro.post_id)}
          >
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.eliminarButton]}
            onPress={() => handleEliminar(muro.post_id)}
          >
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: "#27AE60" }]} 
          onPress={() => handleRestaurar(muro.post_id)}
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
        <Text style={styles.crearButtonText}>+ Crear Nuevo muro
</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#1ABC9C",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  scrollView: {
    padding: 15,
    flex: 1,
  },
  muroCard: {
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
  muroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  muroCategoria: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1ABC9C",
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muroFecha: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  muroTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 15,
    lineHeight: 22,
  },
  murotats: {
    flexDirection: "row",
    marginBottom: 15,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C2833",
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  editarButton: {
    backgroundColor: "#3498DB",
  },
  eliminarButton: {
    backgroundColor: "#E74C3C",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  crearButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  crearButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MiMuroScreen;