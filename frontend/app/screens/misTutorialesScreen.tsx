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
import { getPostsByUserIdAndCategoryId } from "../../apis/postsApi"; 
import { Ionicons } from "@expo/vector-icons";

const MisTutorialesScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
  const [tutoriales, setTutoriales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriaId = 1;

  useEffect(() => {
    
    const fetchTutoriales = async () => {
      try {
        const id = await AsyncStorage.getItem("userId"); 
        if (!id) return;

        const data = await getPostsByUserIdAndCategoryId(Number(id), categoriaId);
        setTutoriales(data);
      } catch (error) {
        console.error("Error cargando tutoriales:", error);
        Alert.alert("Error", "No se pudieron cargar los tutoriales");
      } finally {
        setLoading(false);
      }
    };

    fetchTutoriales();
  },[route.params?.refresh]);

  const handleEditar = (postId: number) => {
  navigation.navigate("EditarPostScreen", { postId });
  };

  const handleEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Tutorial",
      "¿Estás seguro de que quieres eliminar este tutorial?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setTutoriales(tutoriales.filter(t => t.id !== id));
            Alert.alert("Éxito", "Tutorial eliminado correctamente");
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Mis Tutoriales</Text>
        <Text style={styles.headerSubtitle}>{tutoriales.length} tutoriales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#1C2833" />
                  <Text style={styles.backButtonText}>Atrás</Text>
                </TouchableOpacity>
        {tutoriales.map((tutorial) => (
          <View key={tutorial.post_id} style={styles.tutorialCard}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialCategoria}>
                {tutorial.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.tutorialFecha}>{tutorial.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.tutorialFecha}>{tutorial.user_email}</Text>
            
            <Text style={styles.tutorialTitulo}>{tutorial.tittle}</Text>
            <Text style={styles.tutorialTitulo}>{tutorial.description}</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editarButton]}
                onPress={() => handleEditar(tutorial.post_id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(tutorial.post_id)}
              >
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  tutorialCard: {
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
  tutorialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tutorialCategoria: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1ABC9C",
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tutorialFecha: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  tutorialTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 15,
    lineHeight: 22,
  },
  tutorialStats: {
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

export default MisTutorialesScreen;
