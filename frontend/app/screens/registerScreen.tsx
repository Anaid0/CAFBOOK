// app/screens/registerScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { getRoles } from "../../apis/rolesApi";
import { getAllDocumentTypes } from "../../apis/documentTypesApi";
import { createUser } from "../../apis/usersapi";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  // Roles y tipos de documento
  const [roles, setRoles] = useState<{ label: string; value: number }[]>([]);
  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);

  const [role, setRole] = useState<number>(1);
  const [docType, setDocType] = useState<number>(1);

  // Datos personales
  const [firts_name, setFirtsName] = useState("");
  const [last_name, setLastName] = useState("");
  const [document_number, setDocNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Empresa
  const [businessName, setBusinessName] = useState("");
  const [isCattleRancher, setIsCattleRancher] = useState(false);
  const [nit, setNit] = useState("");
  const [profession, setProfession] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔹 Traer roles y tipos de documento desde el backend con Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, docTypesResponse] = await Promise.all([getRoles(), getAllDocumentTypes()]);

        // Verificar y ajustar según la estructura real de la respuesta
        const rolesData = Array.isArray(rolesResponse) ? rolesResponse : (rolesResponse.data || []);
        const docTypesData = Array.isArray(docTypesResponse) ? docTypesResponse : (docTypesResponse.data || []);

        // Mapear correctamente según la estructura {doc_type_id, description} y {role_id, description}
        if (Array.isArray(rolesData)) {
          const formattedRoles = rolesData.map((r: any) => ({ 
            label: r.description || `Rol ${r.role_id}`, 
            value: r.role_id 
          }));
          setRoles(formattedRoles);
          
          if (formattedRoles.length > 0) {
            setRole(formattedRoles[0].value);
          }
        } else {
          console.warn("Roles data is not an array:", rolesData);
          setRoles([{ label: "Usuario", value: 1 }, { label: "Empresa", value: 2 }]);
        }

        if (Array.isArray(docTypesData)) {
          const formattedDocTypes = docTypesData.map((d: any) => ({ 
            label: d.description || `Documento ${d.doc_type_id}`, 
            value: d.doc_type_id 
          }));
          setDocTypes(formattedDocTypes);
          
          if (formattedDocTypes.length > 0) {
            setDocType(formattedDocTypes[0].value);
          }
        } else {
          console.warn("Document types data is not an array:", docTypesData);
          setDocTypes([
            { label: "Cédula de Ciudadanía", value: 1 },
            { label: "Cédula de Extranjería", value: 2 },
            { label: "NIT", value: 3 },
            { label: "Pasaporte", value: 4 }
          ]);
        }

      } catch (error: any) {
        Alert.alert("Error", "No se pudieron cargar roles o tipos de documento");
        console.error("Error fetching data:", error);
        
        // Datos por defecto en caso de error
        setRoles([{ label: "Usuario", value: 1 }, { label: "Empresa", value: 2 }]);
        setDocTypes([
          { label: "Cédula de Ciudadanía", value: 1 },
          { label: "Cédula de Extranjería", value: 2 },
          { label: "NIT", value: 3 },
          { label: "Pasaporte", value: 4 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async () => {
    if (!firts_name || !last_name || !email || !password || !confirmPassword || !document_number) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Ajustado para coincidir con el JSON proporcionado
    const userData: any = {
      firts_name,
      last_name,
      document_number,
      email,
      password,
      doc_type_id: docType,
    };

    // Solo incluir role_id si es diferente del valor por defecto
    if (role !== 1) {
      userData.role_id = role;
    }

    if (role === 2) {
      if (!businessName || !nit) {
        Alert.alert("Error", "Para cuenta empresarial, debe completar razón social y NIT");
        return;
      }
      
      userData.businessName = businessName;
      userData.isCattleRancher = isCattleRancher;
      userData.nit = nit;
      userData.profession = profession;
      userData.yearsOfExperience = yearsOfExperience;
    }

    try {
      await createUser(userData);
      Alert.alert("Éxito", "Cuenta creada correctamente");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || 
        error.message || 
        "Error al crear la cuenta. Por favor intenta nuevamente."
      );
    }
  };

  const renderRoleSpecificFields = () => {
    if (role === 2) {
      return (
        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>Información de la Empresa</Text>

          <Text style={styles.label}>Razón Social *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la empresa"
            value={businessName}
            onChangeText={setBusinessName}
          />

          <Text style={styles.label}>NIT *</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de Identificación Tributaria"
            value={nit}
            onChangeText={setNit}
            keyboardType="numeric"
          />

          <Text style={styles.label}>¿Está registrado en la Cámara de Ganadería?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioOption, isCattleRancher && styles.radioSelected]}
              onPress={() => setIsCattleRancher(true)}
            >
              <Text style={isCattleRancher ? styles.radioTextSelected : styles.radioText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioOption, !isCattleRancher && styles.radioSelected]}
              onPress={() => setIsCattleRancher(false)}
            >
              <Text style={!isCattleRancher ? styles.radioTextSelected : styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Actividad Principal</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Ganadería, Agricultura, Distribución"
            value={profession}
            onChangeText={setProfession}
          />

          <Text style={styles.label}>Años de Experiencia</Text>
          <TextInput
            style={styles.input}
            placeholder="Años en el sector"
            value={yearsOfExperience}
            onChangeText={setYearsOfExperience}
            keyboardType="numeric"
          />
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando roles y tipos de documento...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require("../../assets/images/logoCAFBOOKK.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>CAF-BOOK</Text>
          <Text style={styles.subtitle}>Crear Cuenta</Text>
        </View>

        <Text style={styles.label}>Tipo de Cuenta *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
          >
            {roles.map((roleItem, index) => (
              <Picker.Item
                key={`role-${roleItem.value}-${index}`}
                label={roleItem.label}
                value={roleItem.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Nombres *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={firts_name}
          onChangeText={setFirtsName}
        />

        <Text style={styles.label}>Apellidos *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tus apellidos"
          value={last_name}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Tipo de Documento *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={docType}
            onValueChange={(itemValue) => setDocType(itemValue)}
            style={styles.picker}
          >
            {docTypes.map((typeItem, index) => (
              <Picker.Item
                key={`doc-${typeItem.value}-${index}`}
                label={typeItem.label}
                value={typeItem.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Número de Documento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
          value={document_number}
          onChangeText={setDocNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {renderRoleSpecificFields()}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>
            ¿Ya tienes una cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Estilos (se mantienen igual)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A9DFBF" },
  scrollContent: { padding: 20, paddingTop: 40 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logo: { width: 100, height: 100, resizeMode: "contain", marginBottom: 15 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1C2833", marginBottom: 5 },
  subtitle: { fontSize: 18, color: "#1C2833", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#1C2833", marginBottom: 5, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1C2833", marginTop: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#1ABC9C", paddingBottom: 5 },
  pickerContainer: { backgroundColor: "#FFFFFF", borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#CCC" },
  picker: { width: "100%" },
  input: { backgroundColor: "#FFFFFF", padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#CCC", fontSize: 16 },
  roleSection: { backgroundColor: "#E8F8F5", borderRadius: 10, padding: 15, marginTop: 15, marginBottom: 20 },
  radioContainer: { flexDirection: "row", marginBottom: 15 },
  radioOption: { padding: 12, marginRight: 10, borderRadius: 8, borderWidth: 1, borderColor: "#CCC", backgroundColor: "#FFFFFF", minWidth: 60, alignItems: "center" },
  radioSelected: { backgroundColor: "#1ABC9C", borderColor: "#1ABC9C" },
  radioText: { color: "#1C2833" },
  radioTextSelected: { color: "#FFFFFF", fontWeight: "bold" },
  registerButton: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 25, marginBottom: 15 },
  registerButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  loginLink: { alignItems: "center", marginBottom: 20 },
  loginText: { color: "#1C2833", fontSize: 14 },
  loginLinkText: { color: "#1ABC9C", fontWeight: "bold" },
});

export default RegisterScreen;