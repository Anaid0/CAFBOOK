import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";

const HomeScreen = () => {
  const [commentTexts, setCommentTexts] = useState<{[key: number]: string}>({});

  const publications = [
    {
      id: 1,
      user: "Arturo Mendoza",
      content: "¿Qué productos puedo usar para que mi ternero pueda desarrollarse de forma rápida?",
      comments: []
    },
    {
      id: 2,
      user: "Rosa Rodríguez",
      content: "¿Qué productos puedo usar para empezar a cultivar trigo y también para evitar que plagas ataquen?",
      comments: [
        {
          id: 1,
          user: "Rodrigo Arenas",
          content: "Puedes usar fungicidas y insecticidas como imidacloprid",
          replies: []
        }
      ]
    }
  ];

  const handleComment = (publicationId: number) => {
    const comment = commentTexts[publicationId] || "";
    if (!comment.trim()) {
      Alert.alert("Error", "Por favor escribe un comentario");
      return;
    }
    Alert.alert("Comentario agregado", "Tu comentario se ha agregado exitosamente");
    setCommentTexts({...commentTexts, [publicationId]: ""});
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Muro Publicaciones</Text>
        
        {publications.map((publication) => (
          <View key={publication.id} style={styles.publicationCard}>
            <View style={styles.publicationHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {publication.user.charAt(0)}
                </Text>
              </View>
              <Text style={styles.userName}>{publication.user}</Text>
            </View>
            
            <Text style={styles.publicationContent}>{publication.content}</Text>
            
            <View style={styles.divider} />
            
            {publication.comments.map((comment) => (
              <View key={comment.id} style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                  <View style={[styles.avatarPlaceholder, styles.smallAvatar]}>
                    <Text style={[styles.avatarText, styles.smallAvatarText]}>
                      {comment.user.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
                
                <TouchableOpacity>
                  <Text style={styles.moreComments}>Responder • Más comentarios</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe un comentario..."
                value={commentTexts[publication.id] || ""}
                onChangeText={(text) => setCommentTexts({
                  ...commentTexts, 
                  [publication.id]: text
                })}
              />
              <TouchableOpacity 
                style={styles.commentButton}
                onPress={() => handleComment(publication.id)}
              >
                <Text style={styles.commentButtonText}>Comentar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 15,
  },
  publicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  publicationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1ABC9C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  smallAvatarText: {
    fontSize: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2833",
  },
  publicationContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  commentContainer: {
    backgroundColor: "#F8F9F9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E86C1",
  },
  commentContent: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
  },
  moreComments: {
    fontSize: 12,
    color: "#1ABC9C",
    fontWeight: "500",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F8F9F9",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  commentButton: {
    backgroundColor: "#1ABC9C",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomeScreen;