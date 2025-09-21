import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from "react-native";

const TutorialesScreen = () => {
  const tutorials = [
    {
      id: 1,
      author: "Andres Durango",
      title: "Te enseño como cultivar más de la mejor forma",
      duration: "15:30",
      views: 234
    },
    {
      id: 2,
      author: "Rademel García",
      title: "Te enseño como hacer tu mini huerto en tu casa",
      duration: "22:15",
      views: 178
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutoriales</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {tutorials.map((tutorial) => (
          <View key={tutorial.id} style={styles.card}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {tutorial.author.charAt(0)}
                </Text>
              </View>
              <Text style={styles.authorName}>{tutorial.author}</Text>
            </View>
            
            <Text style={styles.title}>{tutorial.title}</Text>
            
            <View style={styles.videoInfo}>
              <View style={styles.videoThumbnail}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/2889/2889676.png" }}
                  style={styles.playIcon}
                />
              </View>
              
              <View style={styles.videoDetails}>
                <Text style={styles.duration}>Duración: {tutorial.duration}</Text>
                <Text style={styles.views}>{tutorial.views} visualizaciones</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchButtonText}>Ver Tutorial</Text>
            </TouchableOpacity>
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
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2833",
  },
  title: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  videoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: "#E8F8F5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: "#1ABC9C",
  },
  videoDetails: {
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 5,
  },
  views: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  watchButton: {
    backgroundColor: "#1ABC9C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  watchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default TutorialesScreen;