import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const AgregarScreen = () => {
  const navigation = useNavigation<any>();
  const [postType, setPostType] = useState("foro");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Por favor completa los campos obligatorios");
      return;
    }

    const postData = {
      type: postType,
      title,
      category,
      description,
      content,
      date: new Date().toISOString(),
      author: "Usuario Actual" // Puedes reemplazar con el usuario real
    };

    console.log("Publicación creada:", postData);
    Alert.alert("Éxito", "Publicación creada correctamente");
    
    // Limpiar formulario
    setTitle("");
    setCategory("");
    setDescription("");
    setContent("");
    
    // Navegar de vuelta al home o mostrar mensaje
    navigation.navigate("Home");
  };

  const renderFieldsByType = () => {
    switch (postType) {
      case "manual":
        return (
          <>
            <Text style={styles.label}>Título del Manual *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Guía completa de cultivo de maíz"
              value={title}
              onChangeText={setTitle}
            />
            
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Agricultura, Ganadería, Cultivos"
              value={category}
              onChangeText={setCategory}
            />
            
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe brevemente el manual..."
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            
            <Text style={styles.label}>Contenido *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe el contenido completo del manual..."
              multiline
              numberOfLines={6}
              value={content}
              onChangeText={setContent}
            />
            
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachButtonText}>+ Adjuntar PDF</Text>
            </TouchableOpacity>
          </>
        );
      
      case "tutorial":
        return (
          <>
            <Text style={styles.label}>Título del Tutorial *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Cómo prevenir plagas en cultivos"
              value={title}
              onChangeText={setTitle}
            />
            
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Control de plagas, Riego, Fertilización"
              value={category}
              onChangeText={setCategory}
            />
            
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe brevemente el tutorial..."
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />
            
            <Text style={styles.label}>Contenido *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Explica paso a paso el tutorial..."
              multiline
              numberOfLines={6}
              value={content}
              onChangeText={setContent}
            />
            
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachButtonText}>+ Adjuntar Video</Text>
            </TouchableOpacity>
          </>
        );
      
      case "foro":
      default:
        return (
          <>
            <Text style={styles.label}>Título de la Discusión *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: ¿Cómo mejorar el rendimiento de mis cultivos?"
              value={title}
              onChangeText={setTitle}
            />
            
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Cultivos, Ganadería, Tecnología Agrícola"
              value={category}
              onChangeText={setCategory}
            />
            
            <Text style={styles.label}>Contenido *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe tu pregunta o tema de discusión..."
              multiline
              numberOfLines={8}
              value={content}
              onChangeText={setContent}
            />
            
            <TouchableOpacity style={styles.attachButton}>
              <Text style={styles.attachButtonText}>+ Adjuntar Imagen</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Nueva Publicación</Text>
          <Text style={styles.subtitle}>Comparte conocimiento con la comunidad</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Tipo de Publicación *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={postType}
              onValueChange={(itemValue) => setPostType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Foro de Discusión" value="foro" />
              <Picker.Item label="Manual/Guía" value="manual" />
              <Picker.Item label="Tutorial" value="tutorial" />
            </Picker>
          </View>

          {renderFieldsByType()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.publishButton} 
              onPress={handlePublish}
            >
              <Text style={styles.publishButtonText}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Consejos para una buena publicación:</Text>
          <Text style={styles.tip}>• Sé claro y específico en tu título</Text>
          <Text style={styles.tip}>• Usa categorías relevantes</Text>
          <Text style={styles.tip}>• Incluye todos los detalles importantes</Text>
          <Text style={styles.tip}>• Revisa la ortografía antes de publicar</Text>
        </View>
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
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2833",
    marginBottom: 8,
    marginTop: 15,
  },
  pickerContainer: {
    backgroundColor: "#F8F9F9",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  picker: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F8F9F9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  attachButton: {
    backgroundColor: "#E8F8F5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1ABC9C",
    borderStyle: "dashed",
  },
  attachButtonText: {
    color: "#1ABC9C",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#7F8C8D",
    fontWeight: "600",
    fontSize: 16,
  },
  publishButton: {
    backgroundColor: "#1ABC9C",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  publishButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  tipsContainer: {
    backgroundColor: "#E8F8F5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2833",
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    color: "#566573",
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default AgregarScreen;