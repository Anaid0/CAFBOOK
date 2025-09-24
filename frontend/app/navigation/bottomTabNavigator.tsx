import React, { useState } from 'react';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { 
  Image, 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  SafeAreaView,
  Platform,
  StatusBar 
} from 'react-native';

// Importa tus pantallas
import HomeScreen from '../screens/homeScreen';
import ManualesScreen from '../screens/manualesScreen';
import TutorialesScreen from '../screens/tutorialesScreen';
import ForosScreen from '../screens/forosScreen';
import ProfileScreen from '../screens/profileScreenUser';
import AgregarScreen from '../screens/agregarScreen';
import CultivosScreen from '../screens/cultivosScreen';

const Tab = createBottomTabNavigator();

// Define la interfaz para las props
interface CustomTabBarButtonProps extends BottomTabBarButtonProps {
  children: React.ReactNode;
}

const CustomTabBarButton = ({ children, onPress }: CustomTabBarButtonProps) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
  >
    <View style={styles.buttonContainer}>
      {children}
    </View>
  </TouchableOpacity>
);

// Componente de Header Fijo
const FixedHeader = () => {
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
        <Text style={headerStyles.appName}>CAF-BOOK</Text>
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

const BottomTabNavigator = () => {
  return (
    <View style={styles.container}>
      {/* Header Fijo con SafeArea */}
      <FixedHeader />
      
      {/* Contenido de las pantallas */}
      <View style={styles.content}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#1ABC9C',
            tabBarInactiveTintColor: '#95A5A6',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Tutoriales"
            component={TutorialesScreen}
            options={{
              tabBarLabel: 'Tutoriales',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2889/2889676.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Manuales"
            component={ManualesScreen}
            options={{
              tabBarLabel: 'Manuales',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2168/2168285.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />
          
          <Tab.Screen
            name="Agregar"
            component={AgregarScreen}
            options={{
              tabBarLabel: 'Agregar',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3524/3524388.png' }}
                  style={{ width: size + 5, height: size + 5, tintColor: '#FFFFFF' }}
                />
              ),
              tabBarButton: (props) => (
                <CustomTabBarButton {...props} />
              ),
            }}
          />
          
          
          <Tab.Screen
            name="Foros"
            component={ForosScreen}
            options={{
              tabBarLabel: 'Foros',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3594/3594466.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Cultivos"
            component={CultivosScreen}
            options={{
              tabBarLabel: 'Cultivos',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/135/135761.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png' }}
                  style={{ width: size, height: size, tintColor: color }}
                />
              ),
            }}
          />
        </Tab.Navigator>
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
  customButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1ABC9C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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

export default BottomTabNavigator;