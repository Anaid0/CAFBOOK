import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from "react-native";

const ManualesScreen = () => {
  const manuals = [
    {
      id: 1,
      author: "Andres Durango",
      description: "Te enseño el paso a paso de como hacer cultivos facilite en casa",
      type: "PDF",
      downloads: 125
    },
    {
      id: 2,
      author: "Tatiana Naranjo",
      description: "Te enseño el paso a paso de como hacer cultivos de biologías de forma fácil",
      type: "PDF",
      downloads: 89
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manuales</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {manuals.map((manual) => (
          <View key={manual.id} style={styles.card}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {manual.author.charAt(0)}
                </Text>
              </View>
              <Text style={styles.authorName}>{manual.author}</Text>
            </View>
            
            <Text style={styles.description}>{manual.description}</Text>
            
            <View style={styles.pdfContainer}>
              <Text style={styles.pdfText}>{manual.type}</Text>
              <Text style={styles.downloads}>{manual.downloads} descargas</Text>
            </View>
            
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Descargar</Text>
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
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  pdfContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pdfText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  downloads: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  downloadButton: {
    backgroundColor: "#1ABC9C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ManualesScreen;