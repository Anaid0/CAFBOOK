import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aquí después conectamos con el backend (authService)
    console.log("Email:", email, "Password:", password);
  };

  return (
    <View style={styles.container}>
    

      {/* Título */}
      <Text style={styles.title}>CAF-BOOK</Text>
      <Text style={styles.subtitle}>"Descubre lo que esta sucediendo en la comunidad Agropecuaria."</Text>

      {/* Input Email */}
      <TextInput
        style={styles.input}
        placeholder="Correo/NIT/Cédula Representante"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input Password */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.links}>
        <Text style={styles.link}>¿Olvidó su contraseña?</Text>
        <Text style={styles.link}>Crear cuenta</Text>
      </View>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          style={styles.googleIcon}
        />
      </TouchableOpacity>

      {/* Términos */}
      <Text style={styles.footer}>Términos y Condiciones.</Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A6E4A6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  link: {
    fontSize: 12,
    color: "#000",
  },
  googleButton: {
    marginTop: 15,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#555",
  },
});
