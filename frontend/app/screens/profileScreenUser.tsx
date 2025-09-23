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
import { useNavigation, useRoute } from "@react-navigation/native"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { getUserById, updateUser, downUser } from "../../apis/usersapi";

const ProfileScreenUser = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (!id) return;

      const userData = await getUserById(Number(id));
      setUser(userData);

      if (userData?.profile_picture) {
        setProfileImage(`${userData.profile_picture}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [route.params?.refresh]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const id = await AsyncStorage.getItem("userId");
      if (!id) return;

      try {
        const formData = new FormData();
        formData.append("profile_picture", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `${user.document_number}.jpg`,
        } as any);

        const updatedUser = await updateUser(Number(id), formData);

        setUser(updatedUser);
        setProfileImage(`${updatedUser.profile_picture}?t=${Date.now()}`);
      } catch (error) {
        console.error("Error subiendo imagen:", error);
      }
    }
  };

  const handleDownUser = async () => {
  try {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres dar de baja tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, dar de baja",
          onPress: async () => {
            const id = await AsyncStorage.getItem("userId");
            if (!id) return;

            await downUser(Number(id));

            Alert.alert("Cuenta dada de baja", "Tu cuenta ha sido deshabilitada.");

            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  } catch (error) {
    console.error("Error dando de baja al usuario:", error);
    Alert.alert("Error", "No se pudo dar de baja la cuenta.");
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
    navigation.navigate("EditProfileUser", { refresh: true });
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
            <TouchableOpacity onPress={handlePickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.first_name?.charAt(0) || "?"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.userName}>
              {user ? `${user.first_name} ${user.last_name}` : "Cargando..."}
            </Text>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Información personal</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{user?.first_name || "..."}</Text>
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
          style={[styles.button, { backgroundColor: "#e43f3fff" }]}
          onPress={handleDownUser}
          >
          <Text style={styles.buttonText}>Dar de baja mi cuenta</Text>
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
    backgroundColor: "#ffffffff",
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
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#1ABC9C",
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  avatarText: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold" },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
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
  button: {
  padding: 15,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 15,
  },
  buttonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  },

});

export default ProfileScreenUser;
