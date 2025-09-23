import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById, updateUser } from "../../apis/usersapi";
import { Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileScreenUser = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (!id) return;

      const userData = await getUserById(Number(id));
      setUser(userData);
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, cerrar sesión", 
          onPress: async () => {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userId");
            navigation.navigate("Login");
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleAddPhoto = async () => {
    try {
      // Pedir permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitas permitir acceso a tus fotos.");
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;

      if (user) {
        await updateUser(user.user_id, { profile_url: imageUri });
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error subiendo foto:", error);
      Alert.alert("Error", "No se pudo actualizar la foto de perfil");
    }
  };

  const handleOptionPress = (option: string) => {
    if (option === "Mis Tutoriales") {
      navigation.navigate("MisTutoriales");
    } else if (option === "Mis Manuales") {
      navigation.navigate("MisManuales");
    } else if (option === "Mis Foros") {
      navigation.navigate("MisForos");
    } else {
      Alert.alert(option, `Navegando a ${option}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CAF BOOK</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleEditProfile}>
            <Text style={styles.editText}>Editar Cuenta</Text>
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              {user?.profile_url ? (
                <Image source={{ uri: user.profile_url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Plus size={40} color="white" />
                </View>
              )}

              {/* Botón flotante para agregar/cambiar foto */}
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Plus size={20} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {user ? `${user.firts_name} ${user.last_name}` : "Cargando..."}
            </Text>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Información personal</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{user?.firts_name || "..."}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Apellido:</Text>
            <Text style={styles.infoValue}>{user?.last_name || "..."}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email || "..."}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>{user?.role_description || "..."}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo de documento:</Text>
            <Text style={styles.infoValue}>{user?.doc_type_description || "..."}</Text>
          </View>

          {/* Opciones adicionales */}
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Mis Tutoriales")}
          >
            <Text style={styles.optionText}>Mis Tutoriales</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Mis Manuales")}
          >
            <Text style={styles.optionText}>Mis Manuales</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Mis Foros")}
          >
            <Text style={styles.optionText}>Mis Foros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Mi muro")}
          >
            <Text style={styles.optionText}>Mi muro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Ayuda")}
          >
            <Text style={styles.optionText}>Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => handleOptionPress("Eliminar Cuenta")}
          >
            <Text style={[styles.optionText, styles.deleteText]}>
              Eliminar Cuenta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.optionText, styles.logoutText]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#1ABC9C", padding: 20, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  scrollView: { flex: 1, padding: 20 },
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  editText: { color: "#1ABC9C", fontWeight: "bold", marginBottom: 15, alignSelf: "flex-end" },
  userInfo: { alignItems: "center" },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1ABC9C",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1ABC9C",
    borderRadius: 20,
    padding: 6,
  },
  userName: { fontSize: 20, fontWeight: "bold", color: "#1C2833" },
  optionsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: { fontSize: 16, fontWeight: "bold", color: "#1C2833" },
  infoValue: { fontSize: 16, color: "#566573" },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: { fontSize: 16, color: "#1C2833" },
  deleteText: { color: "#E74C3C" },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#1ABC9C",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 0,
  },
  logoutText: { color: "#FFFFFF", fontWeight: "bold" },
});

export default ProfileScreenUser;
