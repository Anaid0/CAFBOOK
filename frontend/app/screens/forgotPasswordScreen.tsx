// app/screens/ForgotPasswordScreen.tsx
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");

  const handleReset = () => {
    Alert.alert("Recuperación enviada", `Se envió un enlace a ${email}`);
    navigation.navigate("Login");
  };

  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#1C2833" />
                <Text style={styles.backButtonText}>Atrás</Text>
              </TouchableOpacity>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput style={styles.input} placeholder="Ingresa tu correo" value={email} onChangeText={setEmail} />
      
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Enviar enlace</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#E8F8F5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  resetButton: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  resetText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ForgotPasswordScreen;
