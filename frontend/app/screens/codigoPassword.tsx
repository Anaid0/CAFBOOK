// app/screens/codigoPassword.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const CodigoPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCodeChange = (text: string, index: number) => {
    // Permitir solo números
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Auto-focus al siguiente campo
    if (numericText && index < 5) {
      // Enfocar el siguiente input
      // Necesitarías usar refs para esto, pero por simplicidad usamos este enfoque
    }
  };

  const handleResetPassword = () => {
    // Validaciones
    if (code.some(digit => digit === "")) {
      Alert.alert("Error", "Por favor completa todos los dígitos del código");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa ambos campos de contraseña");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Simular verificación del código
    const verificationCode = "123456"; // Código de ejemplo
    const enteredCode = code.join('');

    if (enteredCode !== verificationCode) {
      Alert.alert("Error", "El código de verificación es incorrecto");
      return;
    }

    // Simular éxito
    Alert.alert(
      "Éxito", 
      "Contraseña restablecida correctamente",
      [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("Login") 
        }
      ]
    );
  };

  const handleResendCode = () => {
    Alert.alert("Código reenviado", "Se ha enviado un nuevo código a tu correo electrónico");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Restablecer Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa el código de verificación que enviamos a tu correo electrónico
          </Text>

          {/* Código de verificación */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Código de verificación</Text>
            <View style={styles.codeInputsContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Reenviar código</Text>
            </TouchableOpacity>
          </View>

          {/* Nueva contraseña */}
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.passwordContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Botón de restablecer */}
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Restablecer Contraseña</Text>
          </TouchableOpacity>

          {/* Volver al login */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.backText}>Volver al Inicio de Sesión</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#1C2833",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  codeContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 15,
  },
  codeInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  codeInput: {
    width: 45,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    fontSize: 20,
    fontWeight: "bold",
  },
  resendText: {
    color: "#1ABC9C",
    fontWeight: "600",
    fontSize: 14,
  },
  passwordContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: "#1ABC9C",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CodigoPasswordScreen;