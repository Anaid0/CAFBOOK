import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginAdmin } from "../../apis/adminApi"; // usamos el nuevo adminApi

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAdmin(email, password);

      setIsLoading(false);

      // Tu backend devuelve SOLO el token
      const { token } = response;

      if (token) {
        console.log("Login exitoso, token:", token);

        await AsyncStorage.setItem("adminToken", token);

        // Redirigir a Main solo con el token
        navigation.navigate("Main", { token });
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Ocurrió un error al iniciar sesión"
      );
    }
  };

  const navigateToForgotPassword = () => navigation.navigate("ForgotPassword");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logoCAFBOOKK.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>CAF-BOOK</Text>
        <Text style={styles.subtitle}>Inicia Sesión como Administrador</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={navigateToForgotPassword}
        style={styles.forgotPasswordLink}
      >
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>Términos y Condiciones.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DFBF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  },
  subtitle: {
    fontSize: 18,
    color: "#1C2833",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#1ABC9C",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#85C1E9",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    color: "#555",
    marginTop: 20,
  },
});

export default LoginScreen;
