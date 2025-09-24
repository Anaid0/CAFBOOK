import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { getPostCategories } from "../../apis/postCategoriesApi";
import { updatePost, getPostById } from "../../apis/postsApi";

type RootStackParamList = {
  EditarPostScreen: { postId: number };
};

type EditarPostRouteProp = RouteProp<RootStackParamList, "EditarPostScreen">;

const EditarPostScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EditarPostRouteProp>();
  const { postId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postCategoryList, setPostCategoryList] = useState<{ label: string; value: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getPostById(postId);
        setTitle(post.tittle || "");
        setDescription(post.description || "");
        setSelectedCategory(post.post_category_id || null);

        const categories = await getPostCategories();
        const formatted = categories.map((c: any) => ({
          label: c.description,
          value: c.post_category_id
        }));
        setPostCategoryList(formatted);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar la publicación o categorías");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !selectedCategory) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      const updatedData = {
        tittle: title.trim(),
        description: description.trim(),
        post_category_id: selectedCategory 
      };
      await updatePost(postId, updatedData);
      Alert.alert("Éxito", "Publicación actualizada correctamente", [
        { text: "OK", onPress: () => navigation.navigate("ProfileScreenUser", { refresh: true }) }
      ]);
    } catch (error) {
      console.error("Error actualizando post:", error);
      Alert.alert("Error", "No se pudo actualizar la publicación.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando publicación...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Tipo de Publicación *</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={postCategoryList}
          value={selectedCategory}
          placeholder={{ label: "Selecciona un tipo", value: null }}
          style={pickerSelectStyles}
        />

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título de la publicación"
        />

        <Text style={styles.label}>Contenido *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          placeholder="Contenido de la publicación"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center"
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 15
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 15
  }
};

export default EditarPostScreen;
