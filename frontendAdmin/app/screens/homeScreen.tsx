import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsers, createUser, downUser, updateUser, restoreUser } from "../../apis/usersapi";
import { getAllCompanies, createCompany, updateCompany, downCompany, restoreCompany } from "../../apis/companiesApi";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<"users" | "companies">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [token, setToken] = useState<string>("");

  const [newUser, setNewUser] = useState<any>({
    firts_name: "",
    last_name: "",
    document_number: "",
    email: "",
    password: "",
    doc_type_id: 1,
  });

  const [newCompany, setNewCompany] = useState<any>({
    bussines_name: "",
    document_number: "",
    profession: "",
    years_experience: 0,
    email: "",
    password: "",
    doc_type_id: 1,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newPassword, setNewPassword] = useState(""); // ✅ Nuevo estado para contraseña

  useEffect(() => {
    loadTokenAndData();
  }, []);

  const loadTokenAndData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("adminToken");
      
      if (!userToken) {
        Alert.alert("Error", "No hay sesión activa. Redirigiendo al login...");
        return;
      }
      
      setToken(userToken);
      await fetchUsers(userToken);
      await fetchCompanies(userToken);
    } catch (error) {
      console.error("Error inicializando:", error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    }
  };

  const fetchUsers = async (userToken?: string) => {
    try {
      const authToken = userToken || token;
      if (!authToken) {
        Alert.alert("Error", "Token de autenticación no disponible");
        return;
      }
      
      const res = await getUsers(authToken);
      setUsers(res);
    } catch (error: any) {
      console.error("Error cargando usuarios:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado. Por favor, inicie sesión nuevamente.");
      } else {
        Alert.alert("Error", "No se pudieron cargar los usuarios");
      }
    }
  };

  const fetchCompanies = async (userToken?: string) => {
    try {
      const authToken = userToken || token;
      if (!authToken) {
        Alert.alert("Error", "Token de autenticación no disponible");
        return;
      }

      const res = await getAllCompanies();
      setCompanies(res);
    } catch (error: any) {
      console.error("Error cargando empresas:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado. Por favor, inicie sesión nuevamente.");
      } else {
        Alert.alert("Error", "No se pudieron cargar las empresas");
      }
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!newUser.firts_name || !newUser.last_name || !newUser.document_number || !newUser.email || !newUser.password) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      await createUser(newUser);
      fetchUsers();
      setNewUser({
        firts_name: "",
        last_name: "",
        document_number: "",
        email: "",
        password: "",
        doc_type_id: 1,
      });
      Alert.alert("Éxito", "Usuario creado correctamente");
    } catch (error: any) {
      console.error("Error creando usuario:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo crear el usuario");
      }
    }
  };

  const handleCreateCompany = async () => {
    try {
      if (!newCompany.bussines_name || !newCompany.document_number || !newCompany.email || !newCompany.password) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      await createCompany(newCompany);
      fetchCompanies();
      setNewCompany({
        bussines_name: "",
        document_number: "",
        profession: "",
        years_experience: 0,
        email: "",
        password: "",
        doc_type_id: 1,
      });
      Alert.alert("Éxito", "Empresa creada correctamente");
    } catch (error: any) {
      console.error("Error creando empresa:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo crear la empresa");
      }
    }
  };

  const handleToggleUser = async (user: any) => {
    try {
      if (user.status) {
        await downUser(user.user_id);
        Alert.alert("Éxito", "Usuario desactivado correctamente");
      } else {
        await restoreUser(user.user_id);
        Alert.alert("Éxito", "Usuario activado correctamente");
      }
      fetchUsers();
    } catch (error: any) {
      console.error("Error cambiando estado:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el estado del usuario");
      }
    }
  };

  const handleToggleCompany = async (company: any) => {
    try {
      if (company.status) {
        await downCompany(company.company_id);
        Alert.alert("Éxito", "Empresa desactivada correctamente");
      } else {
        await restoreCompany(company.company_id);
        Alert.alert("Éxito", "Empresa activada correctamente");
      }
      fetchCompanies();
    } catch (error: any) {
      console.error("Error cambiando estado:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el estado de la empresa");
      }
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setNewPassword(""); // ✅ Limpiar contraseña al abrir modal
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (activeTab === "users") {
        if (!editingItem.firts_name || !editingItem.last_name || !editingItem.document_number || !editingItem.email) {
          Alert.alert("Error", "Todos los campos son obligatorios");
          return;
        }

        // ✅ Crear objeto con contraseña opcional
        const userDataToUpdate: any = {
          firts_name: editingItem.firts_name,
          last_name: editingItem.last_name,
          document_number: editingItem.document_number,
          email: editingItem.email,
          doc_type_id: editingItem.doc_type_id || 1
        };

        // ✅ Solo agregar contraseña si se proporcionó una nueva
        if (newPassword && newPassword.trim() !== "") {
          userDataToUpdate.password = newPassword;
        }

        await updateUser(editingItem.user_id, userDataToUpdate, token);
        fetchUsers();
        
      } else if (activeTab === "companies") {
        if (!editingItem.bussines_name || !editingItem.document_number || !editingItem.email) {
          Alert.alert("Error", "Todos los campos son obligatorios");
          return;
        }

        // ✅ Lógica similar para empresas
        const companyDataToUpdate: any = {
          bussines_name: editingItem.bussines_name,
          document_number: editingItem.document_number,
          profession: editingItem.profession,
          years_experience: editingItem.years_experience,
          email: editingItem.email,
          doc_type_id: editingItem.doc_type_id || 1
        };

        if (newPassword && newPassword.trim() !== "") {
          companyDataToUpdate.password = newPassword;
        }

        await updateCompany(editingItem.company_id, companyDataToUpdate);
        fetchCompanies();
      }
      
      setModalVisible(false);
      setEditingItem(null);
      setNewPassword(""); // ✅ Limpiar contraseña
      Alert.alert("Éxito", "Datos actualizados correctamente");
    } catch (error: any) {
      console.error("Error actualizando:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudieron actualizar los datos");
      }
    }
  };

  const filterData = (data: any[]) => {
    if (filter === "all") return data;
    if (filter === "active") return data.filter(item => item.status === true);
    if (filter === "inactive") return data.filter(item => item.status === false);
    return data;
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>
            Usuarios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "companies" && styles.activeTab]}
          onPress={() => setActiveTab("companies")}
        >
          <Text style={[styles.tabText, activeTab === "companies" && styles.activeTabText]}>
            Empresas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={[styles.filterText, filter === "all" && styles.activeFilter]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("active")}>
          <Text style={[styles.filterText, filter === "active" && styles.activeFilter]}>Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("inactive")}>
          <Text style={[styles.filterText, filter === "inactive" && styles.activeFilter]}>Inactivos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {activeTab === "users" ? (
          <>
            <Text style={styles.sectionTitle}>Usuarios ({filterData(users).length})</Text>
            {filterData(users).map(u => (
              <View key={u.user_id} style={styles.card}>
                <Text style={styles.cardTitle}>{u.firts_name} {u.last_name}</Text>
                <Text>Email: {u.email}</Text>
                <Text>Documento: {u.document_number}</Text>
                <Text style={[styles.statusText, u.status ? styles.activeStatus : styles.inactiveStatus]}>
                  Estado: {u.status ? "Activo" : "Inactivo"}
                </Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleToggleUser(u)}>
                    <Text style={[styles.actionText, u.status ? styles.deleteText : styles.restoreText]}>
                      {u.status ? "Desactivar" : "Activar"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditItem(u)}>
                    <Text style={[styles.actionText, styles.editText]}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Crear usuario */}
            <Text style={styles.sectionTitle}>Crear Usuario</Text>
            <TextInput 
              placeholder="Nombre" 
              style={styles.input} 
              value={newUser.firts_name} 
              onChangeText={t => setNewUser({ ...newUser, firts_name: t })} 
            />
            <TextInput 
              placeholder="Apellido" 
              style={styles.input} 
              value={newUser.last_name} 
              onChangeText={t => setNewUser({ ...newUser, last_name: t })} 
            />
            <TextInput 
              placeholder="Documento" 
              style={styles.input} 
              value={newUser.document_number} 
              onChangeText={t => setNewUser({ ...newUser, document_number: t })} 
            />
            <TextInput 
              placeholder="Correo" 
              style={styles.input} 
              value={newUser.email} 
              onChangeText={t => setNewUser({ ...newUser, email: t })} 
            />
            <TextInput 
              placeholder="Contraseña" 
              secureTextEntry 
              style={styles.input} 
              value={newUser.password} 
              onChangeText={t => setNewUser({ ...newUser, password: t })} 
            />
            <TouchableOpacity style={styles.createBtn} onPress={handleCreateUser}>
              <Text style={styles.createBtnText}>Crear Usuario</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Empresas ({filterData(companies).length})</Text>
            {filterData(companies).map(c => (
              <View key={c.company_id} style={styles.card}>
                <Text style={styles.cardTitle}>{c.bussines_name}</Text>
                <Text>Email: {c.email}</Text>
                <Text>Documento: {c.document_number}</Text>
                <Text>Profesión: {c.profession}</Text>
                <Text>Años experiencia: {c.years_experience}</Text>
                <Text style={[styles.statusText, c.status ? styles.activeStatus : styles.inactiveStatus]}>
                  Estado: {c.status ? "Activo" : "Inactivo"}
                </Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleToggleCompany(c)}>
                    <Text style={[styles.actionText, c.status ? styles.deleteText : styles.restoreText]}>
                      {c.status ? "Desactivar" : "Activar"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEditItem(c)}>
                    <Text style={[styles.actionText, styles.editText]}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Crear empresa */}
            <Text style={styles.sectionTitle}>Crear Empresa</Text>
            <TextInput 
              placeholder="Nombre Empresa" 
              style={styles.input} 
              value={newCompany.bussines_name} 
              onChangeText={t => setNewCompany({ ...newCompany, bussines_name: t })} 
            />
            <TextInput 
              placeholder="Documento" 
              style={styles.input} 
              value={newCompany.document_number} 
              onChangeText={t => setNewCompany({ ...newCompany, document_number: t })} 
            />
            <TextInput 
              placeholder="Profesión" 
              style={styles.input} 
              value={newCompany.profession} 
              onChangeText={t => setNewCompany({ ...newCompany, profession: t })} 
            />
            <TextInput 
              placeholder="Años de Experiencia" 
              keyboardType="numeric" 
              style={styles.input} 
              value={String(newCompany.years_experience)} 
              onChangeText={t => setNewCompany({ ...newCompany, years_experience: Number(t) || 0 })} 
            />
            <TextInput 
              placeholder="Correo" 
              style={styles.input} 
              value={newCompany.email} 
              onChangeText={t => setNewCompany({ ...newCompany, email: t })} 
            />
            <TextInput 
              placeholder="Contraseña" 
              secureTextEntry 
              style={styles.input} 
              value={newCompany.password} 
              onChangeText={t => setNewCompany({ ...newCompany, password: t })} 
            />
            <TouchableOpacity style={styles.createBtn} onPress={handleCreateCompany}>
              <Text style={styles.createBtnText}>Crear Empresa</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Editar {activeTab === "users" ? "Usuario" : "Empresa"}
            </Text>

            {editingItem && activeTab === "users" && (
              <>
                <TextInput 
                  placeholder="Nombre" 
                  style={styles.input} 
                  value={editingItem.firts_name} 
                  onChangeText={t => setEditingItem({ ...editingItem, firts_name: t })} 
                />
                <TextInput 
                  placeholder="Apellido" 
                  style={styles.input} 
                  value={editingItem.last_name} 
                  onChangeText={t => setEditingItem({ ...editingItem, last_name: t })} 
                />
                <TextInput 
                  placeholder="Documento" 
                  style={styles.input} 
                  value={editingItem.document_number} 
                  onChangeText={t => setEditingItem({ ...editingItem, document_number: t })} 
                />
                <TextInput 
                  placeholder="Correo" 
                  style={styles.input} 
                  value={editingItem.email} 
                  onChangeText={t => setEditingItem({ ...editingItem, email: t })} 
                />
                {/* ✅ Campo para nueva contraseña */}
                <TextInput 
                  placeholder="Nueva contraseña (opcional)" 
                  secureTextEntry 
                  style={styles.input} 
                  value={newPassword} 
                  onChangeText={setNewPassword} 
                />
                <Text style={styles.helpText}>Dejar vacío para mantener la contraseña actual</Text>
              </>
            )}

            {editingItem && activeTab === "companies" && (
              <>
                <TextInput 
                  placeholder="Nombre Empresa" 
                  style={styles.input} 
                  value={editingItem.bussines_name} 
                  onChangeText={t => setEditingItem({ ...editingItem, bussines_name: t })} 
                />
                <TextInput 
                  placeholder="Documento" 
                  style={styles.input} 
                  value={editingItem.document_number} 
                  onChangeText={t => setEditingItem({ ...editingItem, document_number: t })} 
                />
                <TextInput 
                  placeholder="Profesión" 
                  style={styles.input} 
                  value={editingItem.profession} 
                  onChangeText={t => setEditingItem({ ...editingItem, profession: t })} 
                />
                <TextInput 
                  placeholder="Años de Experiencia" 
                  keyboardType="numeric" 
                  style={styles.input} 
                  value={String(editingItem.years_experience)} 
                  onChangeText={t => setEditingItem({ ...editingItem, years_experience: Number(t) || 0 })} 
                />
                <TextInput 
                  placeholder="Correo" 
                  style={styles.input} 
                  value={editingItem.email} 
                  onChangeText={t => setEditingItem({ ...editingItem, email: t })} 
                />
                {/* ✅ Campo para nueva contraseña */}
                <TextInput 
                  placeholder="Nueva contraseña (opcional)" 
                  secureTextEntry 
                  style={styles.input} 
                  value={newPassword} 
                  onChangeText={setNewPassword} 
                />
                <Text style={styles.helpText}>Dejar vacío para mantener la contraseña actual</Text>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveEdit}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  tabContainer: { flexDirection: "row", backgroundColor: "#EAEDED", borderRadius: 8, marginBottom: 10 },
  tab: { flex: 1, padding: 12, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#1ABC9C" },
  tabText: { fontWeight: "bold", color: "#1C2833" },
  activeTabText: { color: "#FFFFFF" },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#FFFFFF", borderRadius: 8, marginBottom: 10 },
  filterText: { color: "#7F8C8D", fontWeight: "600" },
  activeFilter: { color: "#1ABC9C", fontWeight: "bold" },
  scroll: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10, color: "#2C3E50" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#2C3E50" },
  statusText: { marginTop: 5, fontWeight: "600" },
  activeStatus: { color: "#27AE60" },
  inactiveStatus: { color: "#E74C3C" },
  actionsContainer: { flexDirection: "row", gap: 15, marginTop: 10 },
  actionText: { fontWeight: "600" },
  deleteText: { color: "#E74C3C" },
  restoreText: { color: "#27AE60" },
  editText: { color: "#1ABC9C" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#D5D8DC" },
  createBtn: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  createBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%", maxHeight: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#2C3E50" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  saveButton: { backgroundColor: "#1ABC9C" },
  cancelButton: { backgroundColor: "#E74C3C" },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  helpText: { fontSize: 12, color: "#7F8C8D", marginBottom: 10, fontStyle: "italic" }, // ✅ Nuevo estilo para texto de ayuda
});

export default HomeScreen;