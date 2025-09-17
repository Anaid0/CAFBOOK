// app/screens/MisManualesScreen.tsx
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

const MisManualesScreen = () => {
  const navigation = useNavigation<any>();
  const [manuales, setManuales] = useState([
    {
      id: 1,
      titulo: "Manual de Agricultura Sostenible",
      descargas: 234,
      paginas: 45,
      fecha: "20/11/2023",
      formato: "PDF"
    },
    {
      id: 2,
      titulo: "Guía de Nutrición Animal",
      descargas: 167,
      paginas: 32,
      fecha: "10/11/2023",
      formato: "PDF"
    },
    {
      id: 3,
      titulo: "Técnicas de Riego Eficiente",
      descargas: 189,
      paginas: 28,
      fecha: "05/11/2023",
      formato: "PDF"
    }
  ]);

  const handleEditar = (id: number) => {
    navigation.navigate("editarManualesScreen", { id });
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

  const handleDescargar = (manual: any) => {
    Alert.alert("Descargar", `Descargando: ${manual.titulo}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Manuales</Text>
        <Text style={styles.headerSubtitle}>{manuales.length} manuales creados</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {manuales.map((manual) => (
          <View key={manual.id} style={styles.manualCard}>
            <View style={styles.manualHeader}>
              <Text style={styles.manualFormato}>{manual.formato}</Text>
              <Text style={styles.manualFecha}>{manual.fecha}</Text>
            </View>
            
            <Text style={styles.manualTitulo}>{manual.titulo}</Text>
            
            <View style={styles.manualInfo}>
              <Text style={styles.manualPaginas}>{manual.paginas} páginas</Text>
              <Text style={styles.manualDescargas}>{manual.descargas} descargas</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.descargarButton]}
                onPress={() => handleDescargar(manual)}
              >
                <Text style={styles.actionButtonText}>Descargar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.editarButton]}
                onPress={() => handleEditar(manual.id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.eliminarButton]}
                onPress={() => handleEliminar(manual.id)}
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
        <Text style={styles.crearButtonText}>+ Crear Nuevo Manual</Text>
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
  manualFormato: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E74C3C",
    backgroundColor: "#FDEDEC",
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
  manualInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  manualPaginas: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  manualDescargas: {
    fontSize: 14,
    color: "#1ABC9C",
    fontWeight: "600",
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
  descargarButton: {
    backgroundColor: "#27AE60",
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

export default MisManualesScreen;