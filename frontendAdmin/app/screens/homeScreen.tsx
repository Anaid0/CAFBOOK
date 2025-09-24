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
import { getAdmins, createAdmin, downAdmin, updateAdmin, restoreAdmin } from "../../apis/adminApi";
import { getAllDocumentTypes } from "../../apis/documentTypesApi";
import RNPickerSelect from 'react-native-picker-select';

const HomeScreen = ({ searchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState<"users" | "companies" | "admins">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [token, setToken] = useState<string>("");

  // Estados para nuevos registros - CORREGIDOS
  const [newUser, setNewUser] = useState<any>({
    first_name: "", // CORREGIDO: era firts_name
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

  const [newAdmin, setNewAdmin] = useState<any>({
    first_name: "", // CORREGIDO: era firts_name
    last_name: "",
    document_number: "",
    email: "",
    password: "",
    doc_type_id: 1,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadTokenAndData();
  }, []);

  // Efecto para mostrar información de búsqueda
  useEffect(() => {
    if (searchTerm) {
      console.log(`Buscando: ${searchTerm}`);
    }
  }, [searchTerm]);

  const loadTokenAndData = async () => {
    try {
      const userToken = await AsyncStorage.getItem("adminToken");
      
      if (!userToken) {
        Alert.alert("Error", "No hay sesión activa. Redirigiendo al login...");
        return;
      }
      
      setToken(userToken);
      await fetchDocumentTypes(userToken);
      await fetchUsers(userToken);
      await fetchCompanies(userToken);
      await fetchAdmins(userToken);
    } catch (error) {
      console.error("Error inicializando:", error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    }
  };

  const fetchDocumentTypes = async (userToken?: string) => {
    try {
      const authToken = userToken || token;
      if (!authToken) {
        Alert.alert("Error", "Token de autenticación no disponible");
        return;
      }
      
      const docTypesResponse = await getAllDocumentTypes();
      const docTypesData = Array.isArray(docTypesResponse) ? docTypesResponse : (docTypesResponse.data || []);

      if (Array.isArray(docTypesData) && docTypesData.length > 0) {
        const formattedDocTypes = docTypesData.map((d: any) => ({
          label: d.description || `Documento ${d.doc_type_id}`,
          value: d.doc_type_id
        }));
        setDocTypes(formattedDocTypes);
      } else {
        setDocTypes([
          { label: "Cédula de Ciudadanía", value: 1 },
          { label: "Cédula de Extranjería", value: 2 },
          { label: "NIT", value: 3 },
          { label: "Pasaporte", value: 4 }
        ]);
      }
    } catch (error: any) {
      console.error("Error cargando tipos de documento:", error);
      setDocTypes([
        { label: "Cédula de Ciudadanía", value: 1 },
        { label: "Cédula de Extranjería", value: 2 },
        { label: "NIT", value: 3 },
        { label: "Pasaporte", value: 4 }
      ]);
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
      console.error("Error cargando usuarios:", error);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado. Por favor, inicie sesión nuevamente.");
      } else if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
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
      console.error("Error cargando empresas:", error);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado. Por favor, inicie sesión nuevamente.");
      } else if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else {
        Alert.alert("Error", "No se pudieron cargar las empresas");
      }
    }
  };

  const fetchAdmins = async (userToken?: string) => {
    try {
      const authToken = userToken || token;
      if (!authToken) {
        Alert.alert("Error", "Token de autenticación no disponible");
        return;
      }

      const res = await getAdmins(authToken);
      setAdmins(res);
    } catch (error: any) {
      console.error("Error cargando administradores:", error);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado. Por favor, inicie sesión nuevamente.");
      } else if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else {
        Alert.alert("Error", "No se pudieron cargar los administradores");
      }
    }
  };

  // Función para filtrar por email
  const filterByEmail = (data: any[]) => {
    if (!searchTerm) return data;
    
    return data.filter(item => 
      item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateUser = async () => {
    try {
      if (!newUser.first_name || !newUser.last_name || !newUser.document_number || !newUser.email || !newUser.password) {
        Alert.alert("Error", "Todos los campos son obligatorios");
        return;
      }

      // Asegurar que doc_type_id tenga un valor válido
      const userData = {
        ...newUser,
        doc_type_id: newUser.doc_type_id || 1
      };

      console.log("Enviando datos de usuario:", userData);

      await createUser(userData);
      await fetchUsers();
      setNewUser({
        first_name: "",
        last_name: "",
        document_number: "",
        email: "",
        password: "",
        doc_type_id: 1,
      });
      Alert.alert("Éxito", "Usuario creado correctamente");
    } catch (error: any) {
      console.error("Error creando usuario:", error.response?.data);
      
      if (error.response?.status === 500) {
        Alert.alert("Error del Servidor", "Hubo un problema interno en el servidor. Verifica la consola para más detalles.");
        console.error("Detalles del error 500:", error.response.data);
      } else if (error.response?.status === 403) {
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

  const handleCreateAdmin = async () => {
    try {
      if (!newAdmin.email || !newAdmin.password) {
        Alert.alert("Error", "Email y contraseña son obligatorios");
        return;
      }

      await createAdmin(newAdmin);
      fetchAdmins();
      setNewAdmin({
        first_name: "",
        last_name: "",
        document_number: "",
        email: "",
        password: "",
        doc_type_id: 1,
      });
      Alert.alert("Éxito", "Administrador creado correctamente");
    } catch (error: any) {
      console.error("Error creando administrador:", error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo crear el administrador");
      }
    }
  };

  const handleToggleUser = async (user: any) => {
    try {
      if (user.status === 1) {
        await downUser(user.user_id);
        Alert.alert("Éxito", "Usuario desactivado correctamente");
      } else {
        await restoreUser(user.user_id);
        Alert.alert("Éxito", "Usuario activado correctamente");
      }
      fetchUsers();
    } catch (error: any) {
      console.error("Error cambiando estado usuario:", error);
      
      if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el estado del usuario");
      }
    }
  };

  const handleToggleCompany = async (company: any) => {
    try {
      if (company.status === 1) {
        await downCompany(company.company_id);
        Alert.alert("Éxito", "Empresa desactivada correctamente");
      } else {
        await restoreCompany(company.company_id);
        Alert.alert("Éxito", "Empresa activada correctamente");
      }
      fetchCompanies();
    } catch (error: any) {
      console.error("Error cambiando estado empresa:", error);
      
      if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el estado de la empresa");
      }
    }
  };

  const handleToggleAdmin = async (admin: any) => {
    try {
      if (admin.status === 1) {
        await downAdmin(admin.admin_id);
        Alert.alert("Éxito", "Administrador desactivado correctamente");
      } else {
        if (restoreAdmin) {
          await restoreAdmin(admin.admin_id);
          Alert.alert("Éxito", "Administrador activado correctamente");
        } else {
          Alert.alert("Info", "Función de reactivación no disponible temporalmente");
        }
      }
      fetchAdmins();
    } catch (error: any) {
      console.error("Error cambiando estado administrador:", error);
      
      if (error.code === 'ERR_NETWORK') {
        Alert.alert("Error de Conexión", "No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.");
      } else if (error.response?.status === 403) {
        Alert.alert("Error de Autenticación", "Token inválido o expirado");
      } else {
        Alert.alert("Error", error.response?.data?.message || "No se pudo cambiar el estado del administrador");
      }
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
    setNewPassword("");
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (activeTab === "users") {
        if (!editingItem.first_name || !editingItem.last_name || !editingItem.document_number || !editingItem.email) {
          Alert.alert("Error", "Todos los campos son obligatorios");
          return;
        }

        const userDataToUpdate: any = {
          first_name: editingItem.first_name,
          last_name: editingItem.last_name,
          document_number: editingItem.document_number,
          email: editingItem.email,
          doc_type_id: editingItem.doc_type_id || 1
        };

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
      
      } else if (activeTab === "admins") {
        if (!editingItem.email) {
          Alert.alert("Error", "El email es obligatorio");
          return;
        }

        const adminDataToUpdate: any = {
          email: editingItem.email,
          first_name: editingItem.first_name || "",
          last_name: editingItem.last_name || "",
          document_number: editingItem.document_number || "",
          doc_type_id: editingItem.doc_type_id || 1
        };

        if (newPassword && newPassword.trim() !== "") {
          adminDataToUpdate.password = newPassword;
        }

        await updateAdmin(editingItem.admin_id, adminDataToUpdate);
        fetchAdmins();
      }
      
      setModalVisible(false);
      setEditingItem(null);
      setNewPassword("");
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

  const getDocTypeLabel = (docTypeId: number) => {
    const docType = docTypes.find(doc => doc.value === docTypeId);
    return docType ? docType.label : "Desconocido";
  };

  const pickerSelectStyles = {
    inputIOS: { 
      fontSize: 16, 
      paddingVertical: 12, 
      paddingHorizontal: 10, 
      borderWidth: 1, 
      borderColor: '#D5D8DC', 
      borderRadius: 8, 
      color: 'black', 
      paddingRight: 30, 
      backgroundColor: '#FFFFFF', 
      marginBottom: 10 
    },
    inputAndroid: { 
      fontSize: 16, 
      paddingHorizontal: 10, 
      paddingVertical: 8, 
      borderWidth: 1, 
      borderColor: '#D5D8DC', 
      borderRadius: 8, 
      color: 'black', 
      paddingRight: 30, 
      backgroundColor: '#FFFFFF', 
      marginBottom: 10 
    },
    placeholder: { color: '#999' },
  };

  return (
    <View style={styles.container}>
      {/* Información de búsqueda */}
      {searchTerm && (
        <View style={localStyles.searchInfo}>
          <Text style={localStyles.searchText}>
            Buscando: {searchTerm}
          </Text>
          <Text style={localStyles.searchResults}>
            Resultados: {filterData(activeTab === "users" ? users : activeTab === "companies" ? companies : admins).length}
          </Text>
        </View>
      )}

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
        <TouchableOpacity
          style={[styles.tab, activeTab === "admins" && styles.activeTab]}
          onPress={() => setActiveTab("admins")}
        >
          <Text style={[styles.tabText, activeTab === "admins" && styles.activeTabText]}>
            Administradores
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

      {/* Diseño de dos columnas */}
      <View style={styles.twoColumnsContainer}>
        {/* Columna Izquierda - Formularios */}
        <View style={styles.leftColumn}>
          {activeTab === "users" ? (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Crear Nuevo Usuario</Text>
              
              <Text style={styles.label}>Tipo de Documento</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewUser({ ...newUser, doc_type_id: value || 1 })}
                items={docTypes}
                value={newUser.doc_type_id || 1}
                style={pickerSelectStyles}
                placeholder={{ label: "Seleccione tipo de documento", value: undefined }}
              />

              <TextInput 
                placeholder="Número de Documento" 
                style={styles.input} 
                value={newUser.document_number} 
                onChangeText={t => setNewUser({ ...newUser, document_number: t })} 
              />
              <TextInput 
                placeholder="Nombre" 
                style={styles.input} 
                value={newUser.first_name}
                onChangeText={t => setNewUser({ ...newUser, first_name: t })}
              />
              <TextInput 
                placeholder="Apellido" 
                style={styles.input} 
                value={newUser.last_name} 
                onChangeText={t => setNewUser({ ...newUser, last_name: t })} 
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
            </View>
          ) : activeTab === "companies" ? (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Crear Nueva Empresa</Text>
              
              <Text style={styles.label}>Tipo de Documento</Text>
              <RNPickerSelect
                onValueChange={(value) => setNewCompany({ ...newCompany, doc_type_id: value || 1 })}
                items={docTypes}
                value={newCompany.doc_type_id || 1}
                style={pickerSelectStyles}
                placeholder={{ label: "Seleccione tipo de documento", value: undefined }}
              />

              <TextInput 
                placeholder="Número de Documento" 
                style={styles.input} 
                value={newCompany.document_number} 
                onChangeText={t => setNewCompany({ ...newCompany, document_number: t })} 
              />
              <TextInput 
                placeholder="Nombre Empresa" 
                style={styles.input} 
                value={newCompany.bussines_name} 
                onChangeText={t => setNewCompany({ ...newCompany, bussines_name: t })} 
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
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Crear Nuevo Administrador</Text>
              <TextInput 
                placeholder="Correo" 
                style={styles.input} 
                value={newAdmin.email} 
                onChangeText={t => setNewAdmin({ ...newAdmin, email: t })} 
              />
              <TextInput 
                placeholder="Contraseña" 
                secureTextEntry 
                style={styles.input} 
                value={newAdmin.password} 
                onChangeText={t => setNewAdmin({ ...newAdmin, password: t })} 
              />
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateAdmin}>
                <Text style={styles.createBtnText}>Crear Administrador</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Columna Derecha - Listas */}
        <View style={styles.rightColumn}>
          <ScrollView style={styles.scroll}>
            {activeTab === "users" ? (
              <>
                <Text style={styles.sectionTitle}>Lista de Usuarios ({filterData(users).length})</Text>
                {filterData(users).map(u => (
                  <View key={u.user_id} style={styles.card}>
                    <Text style={styles.cardTitle}>{u.first_name} {u.last_name}</Text>
                    <Text>Email: {u.email}</Text>
                    <Text>Documento: {u.document_number}</Text>
                    <Text>Tipo Doc: {getDocTypeLabel(u.doc_type_id)}</Text>
                    <Text style={[styles.statusText, u.status === 1 ? styles.activeStatus : styles.inactiveStatus]}>
                      Estado: {u.status === 1 ? "Activo" : "Inactivo"}
                    </Text>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => handleToggleUser(u)}>
                        <Text style={[styles.actionText, u.status === 1 ? styles.deleteText : styles.restoreText]}>
                          {u.status === 1 ? "Desactivar" : "Activar"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEditItem(u)}>
                        <Text style={[styles.actionText, styles.editText]}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            ) : activeTab === "companies" ? (
              <>
                <Text style={styles.sectionTitle}>Lista de Empresas ({filterData(companies).length})</Text>
                {filterData(companies).map(c => (
                  <View key={c.company_id} style={styles.card}>
                    <Text style={styles.cardTitle}>{c.bussines_name}</Text>
                    <Text>Email: {c.email}</Text>
                    <Text>Documento: {c.document_number}</Text>
                    <Text>Tipo Doc: {getDocTypeLabel(c.doc_type_id)}</Text>
                    <Text>Profesión: {c.profession}</Text>
                    <Text>Años experiencia: {c.years_experience}</Text>
                    <Text style={[styles.statusText, c.status === 1 ? styles.activeStatus : styles.inactiveStatus]}>
                      Estado: {c.status === 1 ? "Activo" : "Inactivo"}
                    </Text>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => handleToggleCompany(c)}>
                        <Text style={[styles.actionText, c.status === 1 ? styles.deleteText : styles.restoreText]}>
                          {c.status === 1 ? "Desactivar" : "Activar"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEditItem(c)}>
                        <Text style={[styles.actionText, styles.editText]}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Lista de Administradores ({filterData(admins).length})</Text>
                {filterData(admins).map(a => (
                  <View key={a.admin_id} style={styles.card}>
                    <Text style={styles.cardTitle}>{a.first_name} {a.last_name}</Text>
                    <Text>Email: {a.email}</Text>
                    <View style={styles.actionsContainer}>

                      <TouchableOpacity onPress={() => handleEditItem(a)}>
                        <Text style={[styles.actionText, styles.editText]}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Modal de edición */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Editar {activeTab === "users" ? "Usuario" : activeTab === "companies" ? "Empresa" : "Administrador"}
            </Text>

            {editingItem && (
              <>
                {activeTab !== "admins" && (
                  <>
                    <Text style={styles.label}>Tipo de Documento</Text>
                    <RNPickerSelect
                      onValueChange={(value) => setEditingItem({ ...editingItem, doc_type_id: value || 1 })}
                      items={docTypes}
                      value={editingItem.doc_type_id || 1}
                      style={pickerSelectStyles}
                      placeholder={{ label: "Seleccione tipo de documento", value: undefined }}
                    />
                  </>
                )}

                {(activeTab === "users") && (
                  <>
                    <TextInput 
                      placeholder="Nombre" 
                      style={styles.input} 
                      value={editingItem.first_name}
                      onChangeText={t => setEditingItem({ ...editingItem, first_name: t })}
                    />
                    <TextInput 
                      placeholder="Apellido" 
                      style={styles.input} 
                      value={editingItem.last_name} 
                      onChangeText={t => setEditingItem({ ...editingItem, last_name: t })} 
                    />
                    <TextInput 
                  placeholder="Número de Documento" 
                  style={styles.input} 
                  value={editingItem.document_number} 
                  onChangeText={t => setEditingItem({ ...editingItem, document_number: t })} 
                />
                  </>
                )}

                

                {activeTab === "companies" && (
                  <>
                    <TextInput 
                      placeholder="Nombre Empresa" 
                      style={styles.input} 
                      value={editingItem.bussines_name} 
                      onChangeText={t => setEditingItem({ ...editingItem, bussines_name: t })} 
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
                  </>
                )}

                <TextInput 
                  placeholder="Correo" 
                  style={styles.input} 
                  value={editingItem.email} 
                  onChangeText={t => setEditingItem({ ...editingItem, email: t })} 
                />
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

// Estilos principales
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5", 
    padding: 15 
  },
  twoColumnsContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
    maxWidth: 400,
  },
  rightColumn: {
    flex: 2,
    marginLeft: 10,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: { 
    flexDirection: "row", 
    backgroundColor: "#EAEDED", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  tab: { 
    flex: 1, 
    padding: 12, 
    alignItems: "center", 
    borderRadius: 8 
  },
  activeTab: { 
    backgroundColor: "#1ABC9C" 
  },
  tabText: { 
    fontWeight: "bold", 
    color: "#1C2833" 
  },
  activeTabText: { 
    color: "#FFFFFF" 
  },
  filterContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    paddingVertical: 10, 
    backgroundColor: "#FFFFFF", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  filterText: { 
    color: "#7F8C8D", 
    fontWeight: "600" 
  },
  activeFilter: { 
    color: "#1ABC9C", 
    fontWeight: "bold" 
  },
  scroll: { 
    flex: 1 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginVertical: 10, 
    color: "#2C3E50" 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 5, 
    color: "#2C3E50" 
  },
  statusText: { 
    marginTop: 5, 
    fontWeight: "600" 
  },
  activeStatus: { 
    color: "#27AE60" 
  },
  inactiveStatus: { 
    color: "#E74C3C" 
  },
  actionsContainer: { 
    flexDirection: "row", 
    gap: 15, 
    marginTop: 10 
  },
  actionText: { 
    fontWeight: "600" 
  },
  deleteText: { 
    color: "#E74C3C" 
  },
  restoreText: { 
    color: "#27AE60" 
  },
  editText: { 
    color: "#1ABC9C" 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#D5D8DC" 
  },
  createBtn: { 
    backgroundColor: "#1ABC9C", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 10 
  },
  createBtnText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 10, 
    width: "90%", 
    maxHeight: "80%" 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center", 
    color: "#2C3E50" 
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
  },
  modalButton: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  saveButton: { 
    backgroundColor: "#1ABC9C" 
  },
  cancelButton: { 
    backgroundColor: "#E74C3C" 
  },
  modalButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  helpText: { 
    fontSize: 12, 
    color: "#7F8C8D", 
    marginBottom: 10, 
    fontStyle: "italic" 
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#2C3E50",
  },
});

// Estilos locales para la información de búsqueda
const localStyles = StyleSheet.create({
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

export default HomeScreen;