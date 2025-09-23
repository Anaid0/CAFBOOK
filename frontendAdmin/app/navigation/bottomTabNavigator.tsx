import React, { useState, useContext, createContext } from 'react';
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

// Crear un contexto para compartir la funcionalidad de búsqueda
const SearchContext = createContext();

// Componente de Header Personalizado
const CustomHeader = () => {
  const [searchText, setSearchText] = useState("");
  const { searchByEmail } = useContext(SearchContext);

  const handleSearch = () => {
    if (!searchText.trim()) {
      alert("Por favor ingresa un email para buscar");
      return;
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchText)) {
      alert("Por favor ingresa un email válido");
      return;
    }
    
    searchByEmail(searchText.trim().toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchText("");
    searchByEmail(""); // Limpiar búsqueda
  };

  return (
    <SafeAreaView style={headerStyles.safeArea}>
      <View style={headerStyles.topBar}>
        <Text style={headerStyles.appName}>CAFBOOK</Text>
        <View style={headerStyles.searchContainer}>
          <TextInput
            style={headerStyles.searchInput}
            placeholder="Buscar por email..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText ? (
            <TouchableOpacity style={headerStyles.clearButton} onPress={handleClearSearch}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828778.png" }}
                style={headerStyles.clearIcon}
              />
            </TouchableOpacity>
          ) : null}
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
  const [searchTerm, setSearchTerm] = useState("");

  const searchByEmail = (email) => {
    setSearchTerm(email);
  };

  const searchContextValue = {
    searchTerm,
    searchByEmail
  };

  return (
    <SearchContext.Provider value={searchContextValue}>
      <View style={styles.container}>
        {/* Header Fijo con CAFBOOK y buscador */}
        <CustomHeader />
        
        {/* Contenido de navegación */}
        <View style={styles.content}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} searchTerm={searchTerm} />}
            </Stack.Screen>
          </Stack.Navigator>
        </View>
      </View>
    </SearchContext.Provider>
  );
};

// Ahora actualiza tu HomeScreen para recibir el searchTerm y filtrar
// Aquí está la versión actualizada de HomeScreen (solo las partes relevantes):

// En tu HomeScreen.tsx, agrega estas funciones y actualiza el filterData:

const UpdatedHomeScreen = ({ searchTerm }) => {
  // ... todo tu código existente ...

  // Función para filtrar por email
  const filterByEmail = (data: any[]) => {
    if (!searchTerm) return data;
    
    return data.filter(item => 
      item.email && item.email.toLowerCase().includes(searchTerm)
    );
  };

  // Combinar filtros: primero por estado, luego por email
  const filterData = (data: any[]) => {
    let filteredData = data;
    
    // Filtro por estado
    if (filter === "active") {
      filteredData = data.filter(item => item.status === 1);
    } else if (filter === "inactive") {
      filteredData = data.filter(item => item.status === 0);
    }
    
    // Filtro por email (si hay búsqueda)
    if (searchTerm) {
      filteredData = filterByEmail(filteredData);
    }
    
    return filteredData;
  };

  // También puedes agregar un efecto para mostrar resultados de búsqueda
  React.useEffect(() => {
    if (searchTerm) {
      // Opcional: mostrar mensaje cuando se está buscando
      console.log(`Buscando: ${searchTerm}`);
    }
  }, [searchTerm]);

  // En tu JSX, puedes mostrar información sobre la búsqueda
  return (
    <View style={styles.container}>
      {/* Mostrar información de búsqueda */}
      {searchTerm && (
        <View style={styles.searchInfo}>
          <Text style={styles.searchText}>
            Buscando: "{searchTerm}"
          </Text>
          <Text style={styles.searchResults}>
            Resultados: {filterData(activeTab === "users" ? users : activeTab === "companies" ? companies : admins).length}
          </Text>
        </View>
      )}
      
      {/* El resto de tu código... */}
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
  // Agregar estos estilos para la información de búsqueda
  searchInfo: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  searchText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
  },
  searchResults: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
    marginLeft: 5,
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#1ABC9C",
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: "#999",
  },
});

export default MainNavigator;