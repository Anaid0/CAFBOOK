// app/screens/EditarTutorialScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Definir los tipos para los parámetros de la ruta
type RootStackParamList = {
  EditarTutorial: { tutorial: Tutorial };
};

type Tutorial = {
  id?: string;
  nombre: string;
  fecha: string;
  descripcion: string;
  categoria: string;
};

// Definir el tipo para la ruta actual
type EditarTutorialRouteProp = RouteProp<RootStackParamList, 'EditarTutorial'>;

const EditarTutorialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EditarTutorialRouteProp>();
  
  // Usar un objeto vacío como valor por defecto si route.params es undefined
  const { tutorial } = route.params || { tutorial: {
    nombre: "",
    fecha: "",
    descripcion: "",
    categoria: ""
  }};

  const [nombre, setNombre] = useState(tutorial?.nombre || "");
  const [fecha, setFecha] = useState(tutorial?.fecha || "");
  const [descripcion, setDescripcion] = useState(tutorial?.descripcion || "");
  const [categoria, setCategoria] = useState(tutorial?.categoria || "");

  const handleGuardar = () => {
    if (!nombre.trim() || !descripcion.trim()) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    // Aquí iría la lógica para guardar en tu backend
    Alert.alert("Éxito", "Tutorial guardado correctamente");
    navigation.goBack();
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={require("../../assets/images/logoCAFBOOKK.png")}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>CAF-BOOK</Text>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png" }}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Editar Tutorial</Text>

        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/725/725305.png" }}
              style={styles.playIcon}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre Tutorial *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del tutorial"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={fecha}
            onChangeText={setFecha}
          />

          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción del tutorial"
            multiline
            numberOfLines={3}
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Categoría del tutorial"
            value={categoria}
            onChangeText={setCategoria}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelar}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1ABC9C",
    padding: 15,
    paddingTop: 50,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C2833",
    textAlign: "center",
    marginVertical: 20,
  },
  videoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: 200,
    height: 120,
    backgroundColor: "#E8F8F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1ABC9C",
    borderStyle: "dashed",
  },
  playIcon: {
    width: 50,
    height: 50,
    tintColor: "#1ABC9C",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  saveButton: {
    backgroundColor: "#1ABC9C",
  },
  cancelButtonText: {
    color: "#E74C3C",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditarTutorialScreen;