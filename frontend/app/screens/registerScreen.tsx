// app/screens/registerScreen.tsx
import React, { useState } from "react";
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
  KeyboardAvoidingView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [role, setRole] = useState("agricultor");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [docType, setDocType] = useState("Cédula");
  const [docNumber, setDocNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Campos específicos para Empresa/Emprendimiento
  const [businessName, setBusinessName] = useState("");
  const [isCattleRancher, setIsCattleRancher] = useState(false);
  const [nit, setNit] = useState("");
  const [profession, setProfession] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const roles = [
    { label: "Agricultor y/o Ganadero", value: "agricultor" },
    { label: "Empresa/Emprendimiento", value: "empresa" }
  ];

  const documentTypes = ["Cédula", "Pasaporte", "Cédula de Extranjería", "NIT"];

  const handleRegister = () => {
    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

    // Datos para enviar al backend
    const userData = {
      role,
      firstName,
      lastName,
      docType,
      docNumber,
      address,
      phone,
      department,
      city,
      email,
      password,
      // Campos condicionales
      ...(role === "empresa" && {
        businessName,
        isCattleRancher,
        nit,
        profession,
        yearsOfExperience,
      }),
    };

    console.log("Datos de registro:", userData);
    Alert.alert("Éxito", "Cuenta creada correctamente");
    navigation.navigate("Login");
  };

  const renderRoleSpecificFields = () => {
    if (role === "empresa") {
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
              style={[
                styles.radioOption,
                isCattleRancher && styles.radioSelected,
              ]}
              onPress={() => setIsCattleRancher(true)}
            >
              <Text style={isCattleRancher ? styles.radioTextSelected : styles.radioText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                !isCattleRancher && styles.radioSelected,
              ]}
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
            {roles.map((roleItem) => (
              <Picker.Item 
                key={roleItem.value} 
                label={roleItem.label} 
                value={roleItem.value} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Información Personal</Text>
        
        <Text style={styles.label}>Nombres *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Apellidos *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tus apellidos"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Tipo de Documento *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={docType}
            onValueChange={(itemValue) => setDocType(itemValue)}
            style={styles.picker}
          >
            {documentTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Número de Documento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de identificación"
          value={docNumber}
          onChangeText={setDocNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección de residencia o finca"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de contacto"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Departamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Departamento"
          value={department}
          onChangeText={setDepartment}
        />

        <Text style={styles.label}>Ciudad/Municipio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ciudad o municipio"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.sectionTitle}>Información de Acceso</Text>

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

        <Text style={styles.footer}>Al registrarte, aceptas nuestros Términos y Condiciones</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DFBF",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#1C2833",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 5,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C2833",
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1ABC9C",
    paddingBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  picker: {
    width: "100%",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    fontSize: 16,
  },
  roleSection: {
    backgroundColor: "#E8F8F5",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  radioOption: {
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#FFFFFF",
    minWidth: 60,
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: "#1ABC9C",
    borderColor: "#1ABC9C",
  },
  radioText: {
    color: "#1C2833",
  },
  radioTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#1C2833",
    fontSize: 14,
  },
  loginLinkText: {
    color: "#1ABC9C",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 12,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegisterScreen;