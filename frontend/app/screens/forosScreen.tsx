import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from "react-native";

const ForosScreen = () => {
  const [commentText, setCommentText] = useState("");

  const forums = [
    {
      id: 1,
      author: "Andres Durango",
      question: "Ustedes creen que la población ganadera esta en exclusión?",
      content: "Yo realmente creo que si porque los jóvenes de ahora solo prefieren la ciudad, jugar relacen y python... cosas interesantes pero no aportan realmente mucho...",
      answers: 12,
      participants: ["Rademel García", "Simunazai", "Rodrigo Arenas"]
    }
  ];

  const answers = [
    {
      id: 1,
      author: "Rodrigo Arenas",
      content: "Yo creo que tenemos que conquistar las calidades para no desaparecer, o nos extinguimos entre nosotros, o nos llevan los altura jack."
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Foros</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {forums.map((forum) => (
          <View key={forum.id} style={styles.card}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {forum.author.charAt(0)}
                </Text>
              </View>
              <Text style={styles.authorName}>{forum.author}</Text>
            </View>
            
            <Text style={styles.question}>{forum.question}</Text>
            <Text style={styles.content}>{forum.content}</Text>
            
            <View style={styles.statsContainer}>
              <Text style={styles.answers}>{forum.answers} respuestas</Text>
              <View style={styles.participants}>
                {forum.participants.map((participant, index) => (
                  <Text key={index} style={styles.participant}>
                    {participant}
                  </Text>
                ))}
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {answers.map((answer) => (
              <View key={answer.id} style={styles.answerContainer}>
                <View style={styles.answerHeader}>
                  <View style={[styles.avatar, styles.smallAvatar]}>
                    <Text style={[styles.avatarText, styles.smallAvatarText]}>
                      {answer.author.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.answerAuthor}>{answer.author}</Text>
                </View>
                <Text style={styles.answerContent}>{answer.content}</Text>
              </View>
            ))}
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe tu respuesta..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity style={styles.commentButton}>
                <Text style={styles.commentButtonText}>Responder</Text>
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
  header: {
    backgroundColor: "#1ABC9C",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    padding: 15,
  },
  card: {
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
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
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
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2833",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  statsContainer: {
    marginBottom: 15,
  },
  answers: {
    fontSize: 14,
    color: "#1ABC9C",
    fontWeight: "600",
    marginBottom: 5,
  },
  participants: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  participant: {
    fontSize: 12,
    color: "#7F8C8D",
    marginRight: 10,
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  answerContainer: {
    backgroundColor: "#F8F9F9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  answerAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E86C1",
  },
  answerContent: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  commentInputContainer: {
    marginTop: 10,
  },
  commentInput: {
    backgroundColor: "#F8F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 80,
    textAlignVertical: "top",
  },
  commentButton: {
    backgroundColor: "#1ABC9C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ForosScreen;