import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createPhone } from "../../apis/phonesApi";

const AgregarTelefonoScreen = () => {
  const navigation = useNavigation<any>();
  const [number, setNumber] = useState("");
  const [numberType, setNumberType] = useState("");

  const handleSave = async () => {
    if (!number || !numberType) {
      Alert.alert("Error", "Debes completar todos los campos");
      return;
    }

    try {
      const newPhone = {
        number,
        number_type: {
          id: parseInt(numberType), // en caso de que manejes id como number
          description: "",
        },
      };

      await createPhone(newPhone); // conexión con la API
      Alert.alert("Éxito", "Teléfono guardado correctamente");

      navigation.goBack(); // volver a MisTelefonosScreen
    } catch (error) {
      console.error("Error al guardar el teléfono:", error);
      Alert.alert("Error", "No se pudo guardar el teléfono");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Teléfono</Text>

      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="ID del tipo de número"
        value={numberType}
        onChangeText={setNumberType}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgregarTelefonoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e", // igual que MiMuroScreen
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2c2c2c",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    backgroundColor: "#4CAF50", // verde igual al muro
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
