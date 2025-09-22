import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../apis/usersapi"; // Asegúrate que la ruta sea correcta

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
      const user = await loginUser(email, password); // Llamada a la API
      setIsLoading(false);

      if (user && user.user_id) {
        console.log("Login exitoso:", user);
        navigation.navigate("home", { user }); // Envía info del usuario a la siguiente pantalla
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

  const navigateToRegister = () => navigation.navigate("Register");
  const navigateToForgotPassword = () => navigation.navigate("ForgotPassword");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/images/logoCAFBOOKK.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>CAF-BOOK</Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>
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

      <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPasswordLink}>
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

      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert("Google Login", "No implementado aún")}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" }}
          style={styles.googleLogo}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.createAccountText}>
          ¿No tienes una cuenta? <Text style={styles.createAccountLink}>Crear cuenta</Text>
        </Text>
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
    marginBottom: 30 
  },
  logo: { 
    width: 100, 
    height: 100, 
    resizeMode: "contain", 
    marginBottom: 15 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#1C2833" 
  },
  subtitle: { 
    fontSize: 18, 
    color: "#1C2833", 
    marginBottom: 15 
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
    fontSize: 16 
  },
  orText: { 
    marginVertical: 15, 
    fontSize: 14, 
    color: "#555" 
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  googleLogo: { 
    width: 24, 
    height: 24, 
    resizeMode: "contain", 
    marginRight: 10 
  },
  googleText: { 
    fontSize: 14, 
    color: "#555" 
  },
  createAccountText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  createAccountLink: {
    color: "#1ABC9C",
    fontWeight: "bold",
  },
  footer: { 
    fontSize: 12, 
    color: "#555", 
    marginTop: 20 
  },
});

export default LoginScreen;
