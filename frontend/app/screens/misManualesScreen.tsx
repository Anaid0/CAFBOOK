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
import { getPostsByUserIdAndCategoryId } from "../../apis/postsApi";

const MisManualesScreen = () => {
  const navigation = useNavigation<any>();
  const [manuales, setManuales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

   const categoriaId= 2;

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
       navigation.navigate("editarmanualesScreen", { id });
     };
   
  const handleEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Manual",
      "¿Estás seguro de que quieres eliminar este manual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setManuales(manuales.filter(m => m.id !== id));
            Alert.alert("Éxito", "Manual eliminado correctamente");
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
        {manuales.map((manual) => (
          <View key={manual.post_id} style={styles.manualCard}>
            <View style={styles.manualHeader}>
              <Text style={styles.manualCategoria}>
                {manual.post_category_description || "Sin categoría"}
              </Text>
              <Text style={styles.manualFecha}>{manual.created_at || "Sin fecha"}</Text>
            </View>

            <Text style={styles.manualFecha}>{manual.user_email}</Text>
            
            <Text style={styles.manualTitulo}>{manual.tittle}</Text>
            <Text style={styles.manualTitulo}>{manual.description}</Text>

            <View style={styles.actionsContainer}>
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
  manualCard: {
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
  manualHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  manualCategoria: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1ABC9C",
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  manualFecha: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  manualTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 15,
    lineHeight: 22,
  },
  manualStats: {
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
export default MisManualesScreen;