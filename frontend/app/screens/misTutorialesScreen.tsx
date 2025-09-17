// app/screens/MisTutorialesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const MisTutorialesScreen = () => {
  const navigation = useNavigation<any>();
  const [tutoriales, setTutoriales] = useState([
    {
      id: 1,
      titulo: "Cómo cultivar maíz eficientemente",
      vistas: 125,
      likes: 45,
      fecha: "15/11/2023",
      categoria: "Agricultura"
    },
    {
      id: 2,
      titulo: "Cuidado de terneros recién nacidos",
      vistas: 89,
      likes: 32,
      fecha: "02/11/2023",
      categoria: "Ganadería"
    },
    {
      id: 3,
      titulo: "Control de plagas orgánico",
      vistas: 156,
      likes: 67,
      fecha: "28/10/2023",
      categoria: "Agricultura"
    }
  ]);

  const handleEditar = (id: number) => {
    navigation.navigate("editarTutorialesScreen", { id });
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

  const handleCrearNuevo = () => {
    Alert.alert("Crear", "Crear nuevo tutorial");
    // navigation.navigate("CrearTutorial");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Tutoriales</Text>
        <Text style={styles.headerSubtitle}>{tutoriales.length} tutoriales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {tutoriales.map((tutorial) => (
          <View key={tutorial.id} style={styles.tutorialCard}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialCategoria}>{tutorial.categoria}</Text>
              <Text style={styles.tutorialFecha}>{tutorial.fecha}</Text>
            </View>
            
            <Text style={styles.tutorialTitulo}>{tutorial.titulo}</Text>
            
            <View style={styles.tutorialStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{tutorial.vistas}</Text>
                <Text style={styles.statLabel}>vistas</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{tutorial.likes}</Text>
                <Text style={styles.statLabel}>likes</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editarButton]}
                onPress={() => handleEditar(tutorial.id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(tutorial.id)}
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