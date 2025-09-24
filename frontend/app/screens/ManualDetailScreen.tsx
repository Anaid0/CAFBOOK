import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostById, createPost } from "../../apis/postsApi";
import { getCommentByPost, createComment } from "../../apis/commentsApi";
import { getPostCategories } from "../../apis/postCategoriesApi";
import { Ionicons } from "@expo/vector-icons";

const ManualDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { postId } = route.params;

  const [manual, setManual] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // Para crear publicación nueva
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [docTypes, setDocTypes] = useState<{ label: string; value: number }[]>([]);
  const [postCategoryId, setPostCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(Number(id));
    };

    const fetchData = async () => {
      try {
        const manualData = await getPostById(postId);
        setManual(manualData);

        const commentsRes = await getCommentByPost(postId);
        setComments(commentsRes.data || []);

        // Traer categorías para nuevo post
        const categories = await getPostCategories();
        const formatted = categories.map((c: any) => ({
          label: c.description,
          value: c.post_category_id
        }));
        setDocTypes(formatted);
        if (formatted.length > 0) setPostCategoryId(formatted[0].value);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchData();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return Alert.alert("Error", "El comentario no puede estar vacío");
    if (!userId) return Alert.alert("Error", "No se encontró el ID de usuario");

    try {
      const commentData = { user_id: userId, content: newComment };
      const res = await createComment(postId, commentData);
      setComments(prev => [...prev, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error creando comentario:", error);
      Alert.alert("Error", "No se pudo crear el comentario");
    }
  };

  const handlePublishPost = async () => {
    if (!title.trim() || !description.trim() || !postCategoryId) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "Usuario no autenticado");
      return;
    }

    try {
      const postData = {
        tittle: title.trim(),
        description: description.trim(),
        post_category_id: postCategoryId,
        user_id: userId
      };
      await createPost(postData);
      Alert.alert("Éxito", "Publicación creada correctamente");
      setTitle("");
      setDescription("");
      setPostCategoryId(docTypes.length > 0 ? docTypes[0].value : undefined);
      navigation.navigate("homeScreen"); // o refresca la lista
    } catch (error) {
      console.error("Error creando post:", error);
      Alert.alert("Error", "No se pudo crear la publicación");
    }
  };

  if (loading || !manual) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando manual...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#1C2833" />
                  <Text style={styles.backButtonText}>Atrás</Text>
                </TouchableOpacity>
        <Text style={styles.title}>{manual.tittle}</Text>
        <Text style={styles.description}>{manual.description}</Text>
        <Text style={styles.user}>Autor: {manual.user_name || manual.user_email}</Text>
        <Text style={styles.date}>Fecha: {manual.created_at}</Text>

        {/* Comentarios */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comentarios:</Text>
          {comments.map(c => (
            <View key={c.comment_id} style={styles.commentCard}>
              <Image
                source={{ uri: c.user_photo || "https://via.placeholder.com/40" }}
                style={styles.commentPhoto}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.commentUser}>{c.user_name}</Text>
                <Text style={styles.commentContent}>{c.content}</Text>
                <Text style={styles.commentDate}>{new Date(c.created_at).toLocaleString()}</Text>
              </View>
            </View>
          ))}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe un comentario..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleSubmitComment}>
              <Text style={styles.commentButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crear nueva publicación */}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.label}>Tipo de Publicación *</Text>
          <View style={styles.pickerContainer}>
            {docTypes.length > 0 ? (
              <Picker
                selectedValue={postCategoryId}
                onValueChange={setPostCategoryId}
              >
                {docTypes.map(d => <Picker.Item key={d.value} label={d.label} value={d.value} />)}
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

          <TouchableOpacity style={styles.publishButton} onPress={handlePublishPost}>
            <Text style={styles.publishButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    backButton: { flexDirection:"row", alignItems:"center", marginBottom:10, padding:5 },
  backButtonText: { fontSize:16, color:"#1C2833", marginLeft:5, fontWeight:"600" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollView: { padding: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  user: { fontSize: 14, marginBottom: 5, color: "#34495E" },
  date: { fontSize: 12, marginBottom: 15, color: "#7F8C8D" },
  commentsSection: { marginTop: 15 },
  commentsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  commentCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8
  },
  commentPhoto: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#BDC3C7" },
  commentUser: { fontWeight: "bold" },
  commentContent: { fontSize: 14 },
  commentDate: { fontSize: 10, color: "#7F8C8D" },
  commentInputContainer: { flexDirection: "row", marginTop: 10 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10
  },
  commentButton: { backgroundColor: "#1ABC9C", borderRadius: 20, paddingHorizontal: 15, justifyContent: "center" },
  commentButtonText: { color: "#FFF", fontWeight: "bold" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 15 },
  pickerContainer: { backgroundColor: "#F8F9F9", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 15, paddingHorizontal: 5, paddingVertical: 2 },
  input: { backgroundColor: "#F8F9F9", borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#E0E0E0" },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  publishButton: { backgroundColor: "#1ABC9C", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  publishButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }
});

export default ManualDetailScreen;
