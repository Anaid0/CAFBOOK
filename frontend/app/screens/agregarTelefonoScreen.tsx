import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createPhone, deletePhone } from "../../apis/phonesApi";
import { createUserPhone, getUserPhones } from "../../apis/usersPhonesApi";
import { getNumberTypes } from "../../apis/numberTypesApi"; 

const AgregarTelefonoScreen = () => {
  const navigation = useNavigation<any>();
  const [numero, setNumero] = useState("");
  const [tipoId, setTipoId] = useState<number | undefined>(undefined);
  const [numberTypes, setNumberTypes] = useState<{ label: string; value: number }[]>([]);
  const [userPhones, setUserPhones] = useState<any[]>([]);

  useEffect(() => {
    const fetchNumberTypes = async () => {
      try {
        const types = await getNumberTypes();
        const formatted = types.map((t: any) => ({ label: t.description, value: t.phone_type_id }));
        setNumberTypes(formatted);
        if (formatted.length > 0) setTipoId(formatted[0].value);
      } catch (error) {
        console.error("Error cargando tipos de número:", error);
        Alert.alert("Error", "No se pudieron cargar los tipos de número");
      }
    };

    const fetchUserPhonesList = async () => {
      try {
        const phones = await getUserPhones();
        setUserPhones(phones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNumberTypes();
    fetchUserPhonesList();
  }, []);

  const handleAgregarTelefono = async () => {
    if (!numero.trim() || !tipoId) {
      return Alert.alert("Error", "Completa todos los campos");
    }

    try {
      const nuevoTelefono = await createPhone({ number: numero.trim(), phone_type_id: tipoId });

      Alert.alert(
        "Confirmar número",
        `¿Desea asignar este número (${numero}) a su cuenta?`,
        [
          { 
            text: "No", 
            style: "cancel", 
            onPress: async () => {
              await deletePhone(nuevoTelefono.phone_id); 
            } 
          },
          { 
            text: "Sí", 
            onPress: async () => {
              const userIdStr = await AsyncStorage.getItem("userId");
              if (!userIdStr) return Alert.alert("Error", "Usuario no autenticado");

              await createUserPhone({ user_id: Number(userIdStr), phone_id: nuevoTelefono.phone_id });
              Alert.alert("Éxito", "Número asignado correctamente");

              setNumero("");
              setTipoId(numberTypes.length > 0 ? numberTypes[0].value : undefined);

              const updatedPhones = await getUserPhones();
              setUserPhones(updatedPhones);
            } 
          },
        ]
      );
    } catch (error) {
      console.error("Error agregando teléfono:", error);
      Alert.alert("Error", "No se pudo agregar el teléfono");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Tipo de Número *</Text>
        <View style={styles.pickerContainer}>
          {numberTypes.length > 0 ? (
            <Picker
              selectedValue={tipoId}
              onValueChange={(itemValue) => setTipoId(itemValue)}
            >
              {numberTypes.map((t) => (
                <Picker.Item key={t.value} label={t.label} value={t.value} />
              ))}
            </Picker>
          ) : (
            <Text>Cargando tipos...</Text>
          )}
        </View>

        <Text style={styles.label}>Número *</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe el número..."
          keyboardType="phone-pad"
          value={numero}
          onChangeText={setNumero}
        />

        <TouchableOpacity style={styles.publishButton} onPress={handleAgregarTelefono}>
          <Text style={styles.publishButtonText}>Agregar Teléfono</Text>
        </TouchableOpacity>

        {/* Lista de teléfonos agregados */}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Tus Teléfonos:</Text>
          {userPhones.map((p) => (
            <View key={p.user_phone_id} style={styles.phoneCard}>
              <Text style={styles.phoneText}>{p.phone.number} ({p.phone_type.description})</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollView: { padding: 20 },
  backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 15 },
  pickerContainer: { backgroundColor: "#F8F9F9", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 15, paddingHorizontal: 5, paddingVertical: 2 },
  input: { backgroundColor: "#F8F9F9", borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#E0E0E0" },
  publishButton: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  publishButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, marginTop: 20 },
  phoneCard: { backgroundColor: "#FFFFFF", padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#E0E0E0" },
  phoneText: { fontSize: 14, color: "#1C2833" },
});

export default AgregarTelefonoScreen;
