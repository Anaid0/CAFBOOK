// app/screens/AgregarDireccionScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAddress } from "../../apis/addressesApi";

const AgregarDireccionScreen = () => {
  const navigation = useNavigation<any>();

  const [street, setStreet] = useState("");
  const [vereda, setVereda] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cityId, setCityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    if (!street.trim() || !postalCode.trim() || !cityId.trim() || !cityName.trim()) {
      Alert.alert("Error", "Por favor llena todos los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      const payload: any = {
        street: street.trim(),
        vereda: vereda?.trim() ? vereda.trim() : undefined,
        postal_code: postalCode.trim(),
        city_id: Number(cityId),
        city_name: cityName.trim(),
      };

      // opcional incluir user_id si tu backend lo espera
      if (userId) payload.user_id = Number(userId);

      // Llamada a tu API (createAddress devuelve la respuesta de axios)
      await createAddress(payload);

      Alert.alert("Éxito", "Dirección agregada correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al agregar dirección:", error);
      Alert.alert("Error", "No se pudo guardar la dirección");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agregar Dirección</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Calle *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Calle 123 #45-67"
          value={street}
          onChangeText={setStreet}
        />

        <Text style={styles.label}>Vereda (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Vereda"
          value={vereda}
          onChangeText={setVereda}
        />

        <Text style={styles.label}>Código Postal *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 110111"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        <Text style={styles.label}>ID de Ciudad *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 101"
          value={cityId}
          onChangeText={setCityId}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nombre de Ciudad *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Bogotá"
          value={cityName}
          onChangeText={setCityName}
        />

        <TouchableOpacity style={styles.crearButton} onPress={handleGuardar} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.crearButtonText}>Guardar Dirección</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  form: { padding: 20 },
  label: { fontSize: 14, color: "#1C2833", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D5DBDB",
  },
  crearButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  crearButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default AgregarDireccionScreen;
