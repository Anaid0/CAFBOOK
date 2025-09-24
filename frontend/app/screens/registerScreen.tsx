// RegisterScreen.tsx
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
import { useNavigation } from "@react-navigation/native";
import { getRoles } from "../../apis/rolesApi";
import { getAllDocumentTypes } from "../../apis/documentTypesApi";
import { createUser } from "../../apis/usersapi"; // API usuarios
import { createCompany } from "../../apis/companiesApi"; // API empresas
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const [roles, setRoles] = useState<{ label: string; value: number }[]>([]);
  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<number>(1); 
  const [docType, setDocType] = useState<number>(1);

  // Campos comunes
  const [document_number, setDocNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Campos para USUARIO
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  // Campos para EMPRESA
  const [business_name, setBusinessName] = useState("");
  const [profession, setProfession] = useState("");
  const [years_experience, setYearsExperience] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, docTypesResponse] = await Promise.all([getRoles(), getAllDocumentTypes()]);
        const rolesData = Array.isArray(rolesResponse.data) ? rolesResponse.data : rolesResponse;
        const docTypesData = Array.isArray(docTypesResponse.data) ? docTypesResponse.data : docTypesResponse;

        setRoles(rolesData.length ? rolesData.map((r: any) => ({
          label: r.description || `Rol ${r.role_id}`,
          value: r.role_id
        })) : [{ label: "Usuario", value: 1 }, { label: "Empresa", value: 2 }]);

        setDocTypes(docTypesData.length ? docTypesData.map((d: any) => ({
          label: d.description || `Documento ${d.doc_type_id}`,
          value: d.doc_type_id
        })) : [
          { label: "Cédula de Ciudadanía", value: 1 },
          { label: "Cédula de Extranjería", value: 2 },
          { label: "NIT", value: 3 },
          { label: "Pasaporte", value: 4 }
        ]);

      } catch (error) {
        console.error("Error fetching roles/doc types:", error);
        Alert.alert("Error", "No se pudieron cargar roles o tipos de documento");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async () => {
    // Validaciones comunes
    if (!email || !password || !confirmPassword || !document_number) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
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

    try {
      if (role === 1) { // USUARIO
        if (!first_name || !last_name) {
          Alert.alert("Error", "Completa nombres y apellidos para usuario");
          return;
        }
        const userData = {
          first_name,
          last_name,
          document_number,
          email,
          password,
          doc_type_id: docType,
          role_id: role,
        };
        await createUser(userData);

      } else if (role === 2) { // EMPRESA
        if (!business_name || !profession) {
          Alert.alert("Error", "Completa razón social y profesión para empresa");
          return;
        }
        const companyData = {
          business_name,
          profession,
          years_experience: years_experience ? parseInt(years_experience, 10) : 0,
          document_number,
          email,
          password,
          doc_type_id: docType,
          role_id: role,
        };
        await createCompany(companyData);
      }

      Alert.alert("Éxito", "Cuenta creada correctamente");
      navigation.navigate("Login");

    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Error al crear la cuenta"
      );
    }
  };

  const renderUserFields = () => role === 1 && (
    <>
      <Text style={styles.label}>Nombres *</Text>
      <TextInput style={styles.input} placeholder="Tu nombre" value={first_name} onChangeText={setFirstName} />
      <Text style={styles.label}>Apellidos *</Text>
      <TextInput style={styles.input} placeholder="Tus apellidos" value={last_name} onChangeText={setLastName} />
    </>
  );

  const renderCompanyFields = () => role === 2 && (
    <View style={styles.roleSection}>
      <Text style={styles.sectionTitle}>Información de la Empresa</Text>
      <Text style={styles.label}>Razón Social *</Text>
      <TextInput style={styles.input} placeholder="Nombre de la empresa" value={business_name} onChangeText={setBusinessName} />
      <Text style={styles.label}>Profesión/Actividad Principal *</Text>
      <TextInput style={styles.input} placeholder="Ej: Ganadería, Agricultura, Comercio" value={profession} onChangeText={setProfession} />
      <Text style={styles.label}>Años de Experiencia</Text>
      <TextInput style={styles.input} placeholder="Años en el sector" value={years_experience} onChangeText={setYearsExperience} keyboardType="numeric" />
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require("../../assets/images/logoCAFBOOKK.png")} style={styles.logo} />
          <Text style={styles.title}>CAF-BOOK</Text>
          <Text style={styles.subtitle}>Crear Cuenta</Text>
        </View>

        <Text style={styles.label}>Tipo de Cuenta *</Text>
        <RNPickerSelect onValueChange={(value) => setRole(value || 1)} items={roles} value={role} style={pickerSelectStyles} placeholder={{}} />

        {renderUserFields()}
        {renderCompanyFields()}

        <Text style={styles.label}>Tipo de Documento *</Text>
        <RNPickerSelect onValueChange={(value) => setDocType(value || 1)} items={docTypes} value={docType} style={pickerSelectStyles} placeholder={{}} />

        <Text style={styles.label}>Número de Documento *</Text>
        <TextInput style={styles.input} placeholder="Número de identificación" value={document_number} onChangeText={setDocNumber} keyboardType="numeric" />

        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput style={styles.input} placeholder="correo@ejemplo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Contraseña *</Text>
        <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" secureTextEntry value={password} onChangeText={setPassword} />

        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <TextInput style={styles.input} placeholder="Repite tu contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = {
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#FFFFFF', marginBottom: 10 },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, color: 'black', paddingRight: 30, backgroundColor: '#FFFFFF', marginBottom: 10 },
  placeholder: { color: '#999' },
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#A9DFBF" },
  scrollContent: { padding:20, paddingTop:20 },
  backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  logoContainer: { alignItems:"center", marginBottom:30 },
  logo: { width:100, height:100, resizeMode:"contain", marginBottom:15 },
  title: { fontSize:32, fontWeight:"bold", color:"#1C2833", marginBottom:5 },
  subtitle: { fontSize:18, color:"#1C2833", marginBottom:20 },
  label: { fontSize:14, fontWeight:"600", color:"#1C2833", marginBottom:5, marginTop:10 },
  sectionTitle: { fontSize:18, fontWeight:"bold", color:"#1C2833", marginTop:20, marginBottom:15, borderBottomWidth:1, borderBottomColor:"#1ABC9C", paddingBottom:5 },
  input: { backgroundColor:"#FFFFFF", padding:15, borderRadius:8, marginBottom:10, borderWidth:1, borderColor:"#CCC", fontSize:16 },
  roleSection: { backgroundColor:"#E8F8F5", borderRadius:10, padding:15, marginTop:15, marginBottom:20 },
  registerButton: { backgroundColor:"#1ABC9C", padding:15, borderRadius:8, alignItems:"center", marginTop:25, marginBottom:15 },
  registerButtonText: { color:"#FFFFFF", fontWeight:"bold", fontSize:16 },
  loginLink: { alignItems:"center", marginBottom:20 },
  loginText: { color:"#1C2833", fontSize:14 },
  loginLinkText: { color:"#1ABC9C", fontWeight:"bold" },
});

export default RegisterScreen;
