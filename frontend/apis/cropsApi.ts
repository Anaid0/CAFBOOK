import axios from "axios";

const isWeb = typeof window !== "undefined" && window.document;

export const API_URL = isWeb 
  ? "http://localhost:4200/api"   // Para web
  : "http://192.168.1.2:4200/api"; // Para Android (IP de tu PC en la misma red)

// Configuración común de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: El servidor está tardando demasiado en responder');
    }
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error del servidor');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error de configuración de la solicitud');
    }
  }
);

export const createCrop = async (cropData: any) => {
  const response = await api.post("/crops", cropData);
  return response;
};

export const getCropById = async (id: number) => {
  const response = await api.get(`/crops/${id}`);
  return response;
};

export const getCropsByTypeId = async (typeId: number) => {
  const response = await api.get(`/crops/type/${typeId}`);
  return response;
};

export const getCropsByTypeName = async (name: string) => {
  const response = await api.get(`/crops/type/name/${name}`);
  return response;
};

export const getCropsByUserEmail = async (email: string) => {
  const response = await api.get(`/crops/email/${email}`);
  return response;
};

export const getAllCrops = async () => {
  const response = await api.get("/crops");
  return response;
};

export const updateCrop = async (id: number, cropData: any) => {
  const response = await api.put(`/crops/${id}`, cropData);
  return response;
};

export const deleteCrop = async (id: number) => {
  const response = await api.delete(`/crops/${id}`);
  return response;
};

export const updateCropEstado = async (id: number, estado: 'saludable' | 'en-riesgo' | 'enfermo' | 'cosechado') => {
  const response = await api.patch(`/crops/${id}/estado`, { estado });
  return response;
};