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
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostById } from "../../apis/postsApi";
import { getCommentByPost, createComment, deleteComment } from "../../apis/commentsApi";
import { Ionicons } from "@expo/vector-icons";

const ForoDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [postId, setPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(Number(storedUserId));

        let idPost = route.params?.postId;
        if (!idPost) {
          const storedPostId = await AsyncStorage.getItem("postId");
          if (storedPostId) idPost = Number(storedPostId);
        }

        if (!idPost) return Alert.alert("Error", "No se encontró el ID del foro");
        setPostId(Number(idPost));
        await AsyncStorage.setItem("postId", String(idPost));

        const postData = await getPostById(Number(idPost));
        setPost(postData);

        const commentsRes = await getCommentByPost(Number(idPost));
        setComments(commentsRes.data || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del foro");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params?.refresh]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return Alert.alert("Error", "El comentario no puede estar vacío");
    if (!userId || !postId) return Alert.alert("Error", "Falta el ID de usuario o del foro");

    try {
      const commentData = { user_id: userId, post_id: postId, content: newComment };
      const res = await createComment(postId, commentData);

      setComments(prev => {
        const exists = prev.some(c => c.comment_id === res.data.comment_id);
        if (exists) return prev;
        return [...prev, res.data];
      });

      setNewComment("");
    } catch (error) {
      console.error("Error creando comentario:", error);
      Alert.alert("Error", "No se pudo crear el comentario");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    Alert.alert(
      "Eliminar comentario",
      "¿Estás seguro de que quieres eliminar este comentario?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComment(commentId); 
              setComments(prev => prev.filter(c => c.comment_id !== commentId));
            } catch (error) {
              console.error("Error eliminando comentario:", error);
              Alert.alert("Error", "No se pudo eliminar el comentario");
            }
          }
        }
      ]
    );
  };

  if (loading || !post) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ABC9C" />
        <Text>Cargando foro...</Text>
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

        <Text style={styles.title}>{post.tittle}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.user}>Autor: {post.user_name || post.user_email}</Text>
        <Text style={styles.date}>Fecha: {post.created_at}</Text>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comentarios:</Text>
          {comments.map((c, index) => (
            <View key={c.comment_id || index} style={styles.commentCard}>
              <Image source={{ uri: c.user_photo || null }} style={styles.commentPhoto} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.commentUser}>{c.user_name}</Text>
                <Text style={styles.commentContent}>{c.content}</Text>
                <Text style={styles.commentDate}>{new Date(c.created_at).toLocaleString()}</Text>
              </View>
              {c.user_id === userId && (
                <TouchableOpacity onPress={() => handleDeleteComment(c.comment_id)}>
                  <Ionicons name="trash" size={20} color="#E74C3C" />
                </TouchableOpacity>
              )}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10, padding: 5 },
  backButtonText: { fontSize: 16, color: "#1C2833", marginLeft: 5, fontWeight: "600" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollView: { padding: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  user: { fontSize: 14, marginBottom: 5, color: "#34495E" },
  date: { fontSize: 12, marginBottom: 15, color: "#7F8C8D" },
  commentsSection: { marginTop: 15 },
  commentsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  commentCard: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, backgroundColor: "#F0F0F0", padding: 10, borderRadius: 8 },
  commentPhoto: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#BDC3C7" },
  commentUser: { fontWeight: "bold" },
  commentContent: { fontSize: 14 },
  commentDate: { fontSize: 10, color: "#7F8C8D" },
  commentInputContainer: { flexDirection: "row", marginTop: 10 },
  commentInput: { flex: 1, borderWidth: 1, borderColor: "#BDC3C7", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
  commentButton: { backgroundColor: "#1ABC9C", borderRadius: 20, paddingHorizontal: 15, justifyContent: "center" },
  commentButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default ForoDetailScreen;
