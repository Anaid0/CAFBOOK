// app/screens/MisForosScreen.tsx
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

const MisForosScreen = () => {
  const navigation = useNavigation<any>();
  const [foros, setForos] = useState([
    {
      id: 1,
      titulo: "¿Cómo mejorar el rendimiento de cultivos en temporada seca?",
      respuestas: 23,
      vistas: 156,
      fecha: "22/11/2023",
      categoria: "Agricultura"
    },
    {
      id: 2,
      titulo: "Alimentación adecuada para ganado bovino",
      respuestas: 15,
      vistas: 98,
      fecha: "18/11/2023",
      categoria: "Ganadería"
    },
    {
      id: 3,
      titulo: "Técnicas de control de plagas orgánicas",
      respuestas: 34,
      vistas: 201,
      fecha: "12/11/2023",
      categoria: "Agricultura"
    }
  ]);

  const handleEditar = (id: number) => {
    navigation.navigate("editarForosScreen", { id });
  };

  const handleEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Foro",
      "¿Estás seguro de que quieres eliminar este foro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            setForos(foros.filter(f => f.id !== id));
            Alert.alert("Éxito", "Foro eliminado correctamente");
          }
        }
      ]
    );
  };

  const handleVerRespuestas = (foro: any) => {
    Alert.alert("Respuestas", `Ver respuestas de: ${foro.titulo}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Foros</Text>
        <Text style={styles.headerSubtitle}>{foros.length} foros creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {foros.map((foro) => (
          <View key={foro.id} style={styles.foroCard}>
            <View style={styles.foroHeader}>
              <Text style={styles.foroCategoria}>{foro.categoria}</Text>
              <Text style={styles.foroFecha}>{foro.fecha}</Text>
            </View>
            
            <Text style={styles.foroTitulo}>{foro.titulo}</Text>
            
            <View style={styles.foroStats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{foro.respuestas}</Text>
                <Text style={styles.statLabel}>respuestas</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{foro.vistas}</Text>
                <Text style={styles.statLabel}>vistas</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.respuestasButton]}
                onPress={() => handleVerRespuestas(foro)}
              >
                <Text style={styles.actionButtonText}>Ver Respuestas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.editarButton]}
                onPress={() => handleEditar(foro.id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(foro.id)}
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
        <Text style={styles.crearButtonText}>+ Crear Nuevo Foro</Text>
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
  foroCard: {
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
  foroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  foroCategoria: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9B59B6",
    backgroundColor: "#F4ECF7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foroFecha: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  foroTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 15,
    lineHeight: 22,
  },
  foroStats: {
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
    marginHorizontal: 4,
  },
  respuestasButton: {
    backgroundColor: "#9B59B6",
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
    fontSize: 12,
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

export default MisForosScreen;