import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { getAllDocumentTypes } from "../../apis/documentTypesApi";
import { getUserById, updateUser } from "../../apis/usersapi";

const EditProfileUser = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

 const [user, setUser] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [docType, setDocType] = useState<number | null>(null);
  const [password, setPassword] = useState("");

  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;

        const userData = await getUserById(Number(id));
        setUser(userData);

        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setDocumentNumber(userData.document_number || "");
        setEmail(userData.email || "");
        setDocType(userData.doc_type_id || null);

        const docTypesResponse = await getAllDocumentTypes();
        const formattedDocTypes = docTypesResponse.map((d: any) => ({
          label: d.description,
          value: d.doc_type_id,
        }));
        setDocTypes(formattedDocTypes);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!firstName || !lastName || !documentNumber || !email || !docType) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      const id = await AsyncStorage.getItem("userId");
      if (!id) return;

      const updatedData: any = {
        first_name: firstName,
        last_name: lastName,
        document_number: documentNumber,
        email,
        doc_type_id: docType,
      };

      if (password) {
        if (password.length < 6) {
          Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres.");
          setSaving(false);
          return;
        }
        updatedData.password = password;
      }

      const updatedUser = await updateUser(Number(id), updatedData);
      setUser(updatedUser);
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

    Alert.alert("Éxito", "Perfil actualizado correctamente");
    navigation.navigate("ProfileScreenUser", { refresh: true });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    Alert.alert("Error", "No se pudo actualizar el perfil.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Editar Perfil</Text>

        <Text style={styles.label}>Nombres</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Tipo de Documento</Text>
        <RNPickerSelect
          onValueChange={(value) => setDocType(value)}
          items={docTypes}
          value={docType}
          style={pickerSelectStyles}
          placeholder={{ label: "Selecciona un tipo", value: null }}
        />

        <Text style={styles.label}>Número de Documento</Text>
        <TextInput
          style={styles.input}
          value={documentNumber}
          onChangeText={setDocumentNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#1C2833" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#1C2833" },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
};

export default EditProfileUser;
