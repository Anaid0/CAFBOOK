import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';

// Importa tus pantallas
import HomeScreen from '../screens/homeScreen';

const Stack = createStackNavigator();

// Componente de Header Personalizado
const CustomHeader = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (!searchText.trim()) {
      alert("Por favor ingresa un término de búsqueda");
      return;
    }
    alert(`Buscando: ${searchText}`);
  };

  return (
    <SafeAreaView style={headerStyles.safeArea}>
      <View style={headerStyles.topBar}>
        <Text style={headerStyles.appName}>CAFBOOK</Text>
        <View style={headerStyles.searchContainer}>
          <TextInput
            style={headerStyles.searchInput}
            placeholder="Buscar..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={headerStyles.searchButton} onPress={handleSearch}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png" }}
              style={headerStyles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Componente principal con navegación Stack
const MainNavigator = () => {
  return (
    <View style={styles.container}>
      {/* Header Fijo con CAFBOOK y buscador */}
      <CustomHeader />
      
      {/* Contenido de navegación */}
      <View style={styles.content}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false // Ocultar headers nativos de Stack
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#1ABC9C",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1ABC9C",
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 60,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#1ABC9C",
  },
});

export default MainNavigator;