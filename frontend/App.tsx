import React from "react";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./app/screens/LoginScreen"; // 👈 importamos la pantalla

export default function App() {
  return (
    <>
      <LoginScreen /> 
      <StatusBar style="auto" />
    </>
  );
}
