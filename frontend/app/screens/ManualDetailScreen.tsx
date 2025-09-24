import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { createComment, getCommentByPost } from "../../apis/commentsApi";

type RouteParams = {
  ManualDetailScreen: {
    manual: any;
    userId: number;
  };
};

const ManualDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, "ManualDetailScreen">>();
  const { manual, userId } = route.params;

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await getCommentByPost(manual.post_id);
      setComments(res.data || []);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
      Alert.alert("Error", "No se pudieron cargar los comentarios");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return Alert.alert("Error", "El comentario no puede estar vacío");
    try {
      const commentData = {
      user_id: userId,
      content: newComment,
      };
      const res = await createComment(manual.post_id, commentData);

      setComments(prev => [...prev, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error creando comentario:", error);
      Alert.alert("Error", "No se pudo crear el comentario");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{manual.tittle}</Text>
      <Text style={styles.description}>{manual.description}</Text>
      <Text style={styles.user}>Autor: {manual.user_name || manual.user_email}</Text>
      <Text style={styles.date}>Fecha: {manual.created_at}</Text>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comentarios:</Text>
        {comments.map(c => (
          <View key={c.comment_id} style={styles.commentCard}>
            <Image source={{ uri: c.user_photo || null}} style={styles.commentPhoto} />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F5F5F5" },
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

export default ManualDetailScreen;
