import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { createPost } from "../../apis/postsApi";
import { Ionicons } from "@expo/vector-icons";
import { getPostCategories } from "../../apis/postCategoriesApi"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const AgregarScreen = () => {
  const navigation = useNavigation<any>();
  const [postCategoryId, setPostCategoryId] = useState<number | undefined>(undefined);
  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getPostCategories();
        const formatted = categories.map((c: any) => ({
          label: c.description,
          value: c.post_category_id,
        }));
        setDocTypes(formatted);
        if (formatted.length > 0) setPostCategoryId(formatted[0].value);
      } catch (error) {
        console.error("Error cargando categorías:", error);
        Alert.alert("Error", "No se pudieron cargar las categorías");
      }
    };
    fetchCategories();
  }, []);

  const handlePublish = async () => {
    if (!title.trim() || !description.trim() || !postCategoryId) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    const userIdStr = await AsyncStorage.getItem("userId");
    if (!userIdStr) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    const postData = {
      tittle: title.trim(),
      description: description.trim(),
      post_category_id: postCategoryId,
      user_id: Number(userIdStr)
    };

    try {
      const res = await createPost(postData);
      console.log("Post creado:", res);
      Alert.alert("Éxito", "Publicación creada correctamente");
      
      setTitle("");
      setDescription("");
      setPostCategoryId(docTypes.length > 0 ? docTypes[0].value : undefined);
      navigation.navigate("homeScreen");
    } catch (error) {
      console.error("Error creando post:", error);
      Alert.alert("Error", "No se pudo crear la publicación");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C2833" />
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Tipo de Publicación *</Text>
        <View style={styles.pickerContainer}>
          {docTypes.length > 0 ? (
            <Picker
              selectedValue={postCategoryId}
              onValueChange={(itemValue) => setPostCategoryId(itemValue)}
            >
              {docTypes.map((d) => (
                <Picker.Item key={d.value} label={d.label} value={d.value} />
              ))}
            </Picker>
          ) : (
            <Text>Cargando categorías...</Text>
          )}
        </View>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe el título..."
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Contenido *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escribe tu contenido..."
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollView: { padding: 20 },
   backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  logoContainer: { alignItems:"center", marginBottom:30 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 15 },
  pickerContainer: { backgroundColor: "#F8F9F9", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 15, paddingHorizontal: 5, paddingVertical: 2 },
  input: { backgroundColor: "#F8F9F9", borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#E0E0E0" },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  publishButton: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  publishButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }
});

export default AgregarScreen;
