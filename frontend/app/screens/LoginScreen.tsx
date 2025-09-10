import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TEST_PROFILE = {
  email: "usuario@prueba.com",
  password: "password123"
};

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (email === TEST_PROFILE.email && password === TEST_PROFILE.password) {
        console.log("Login exitoso con perfil de prueba");
        navigation.navigate("Main");
      } else {
        Alert.alert("Error", "Credenciales incorrectas. Usa:\nEmail: usuario@prueba.com\nContraseña: password123");
      }
    }, 1500);
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Esta funcionalidad no está implementada en la versión de prueba");
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/images/logoCAFBOOKK.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>CAF-BOOK</Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>
        
        <View style={styles.testProfileInfo}>
          <Text style={styles.testProfileTitle}>Perfil de Prueba:</Text>
          <Text style={styles.testProfileText}>Email: usuario@prueba.com</Text>
          <Text style={styles.testProfileText}>Contraseña: password123</Text>
        </View>
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
        <Text style={styles.loginButtonText}>
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
          }}
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
  testProfileInfo: {
    backgroundColor: "#F8F9F9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  testProfileTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2E4053",
  },
  testProfileText: {
    fontSize: 12,
    color: "#566573",
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